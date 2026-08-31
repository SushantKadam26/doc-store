/**
 * DocStore CLI — interact with the deployed DocStore contract.
 *
 * The wallet's PRIVATE state holds exactly one document at a time:
 *   - documentContent: Bytes<256>  (the raw document bytes — never leaves the wallet)
 *   - ownerPrivateKey: Bytes<32>   (the wallet's signing key — never leaves the wallet)
 *
 * Only the SHA-256 hash of the content (the documentId) and the public metadata
 * ever reach the blockchain.
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';

// Midnight SDK imports
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateWallet, formatWalletBackupNotice, getDeployment } from './network.ts';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet.ts';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

// Must match the privateStateId used at deploy time so the CLI reconnects to
// the same private state (and thus the same witnesses).
const PRIVATE_STATE_ID = 'docStorePrivateState';

const { network, config: networkConfig } = resolveNetwork();
const WALLET = getOrCreateWallet(network);
const SEED = WALLET.seed;
{
  const notice = formatWalletBackupNotice(WALLET, network);
  if (notice) console.log(notice);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'DocStore');

const contractPath = path.join(zkConfigPath, 'contract', 'index.js');
if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const DocStore = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('DocStore', DocStore.Contract).pipe(
  CompiledContract.withWitnesses({
    documentContent: (context: any) => [
      context.privateState,
      context.privateState.documentContent as Uint8Array,
    ],
    ownerPrivateKey: (context: any) => [
      context.privateState,
      context.privateState.ownerPrivateKey as Uint8Array,
    ],
  } as never),
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function pad32(s: string): Uint8Array {
  const bytes = Buffer.from(s, 'hex');
  if (bytes.length !== 32) throw new Error('Expected 32 bytes (64 hex chars)');
  return new Uint8Array(bytes);
}

function pad256(s: string): Uint8Array {
  const bytes = Buffer.from(s);
  const out = new Uint8Array(256);
  out.set(bytes.subarray(0, Math.min(bytes.length, 256)));
  return out;
}

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

// ─── Providers ─────────────────────────────────────────────────────────────────

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'docstore-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function queryLedger(providers: Awaited<ReturnType<typeof createProviders>>, contractAddress: string) {
  const contractState = await providers.publicDataProvider.queryContractState(contractAddress);
  if (!contractState) return null;
  return DocStore.ledger(contractState.data);
}

// ─── Main CLI ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    DocStore CLI                         ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const isTTY = !!stdin.isTTY;
  const pipedLines: string[] = [];
  if (!isTTY) {
    let all = '';
    for await (const chunk of stdin) all += String(chunk);
    pipedLines.push(...all.split('\n').map((l) => l.trimEnd()));
  }
  const rl = isTTY ? createInterface({ input: stdin, output: stdout }) : null;
  const ask = async (q: string): Promise<string> => {
    if (!rl) {
      const line = pipedLines.shift();
      return line ?? '';
    }
    return rl.question(q);
  };

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run \`npm run setup -- --network ${network}\` first.`);
    process.exit(1);
  }
  console.log(`  Contract: ${deployment.address}`);
  console.log(`  Network: ${network}\n`);

  try {
    const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
    const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;
    if (restoredCount > 0) {
      console.log(`  Restored ${restoredCount}/3 child wallets from .midnight-wallet-state — sync will resume from saved point.`);
    }

    console.log('  Syncing with network...');
    const syncStart = Date.now();
    const syncInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - syncStart) / 1000);
      process.stdout.write(`\r  ⏳ Still syncing... (${elapsed}s elapsed)   `);
    }, 5000);
    const state = await walletCtx.wallet.waitForSyncedState();
    clearInterval(syncInterval);
    process.stdout.write('\r  ✓ Synced with network.                                      \n');

    await persistWalletState(network, walletCtx);
    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    console.log(`  Balance: ${balance.toLocaleString()} tNight\n`);

    if (balance === 0n && network !== 'undeployed' && networkConfig.faucet) {
      const address = walletCtx.unshieldedKeystore.getBech32Address();
      console.log('  ⚠ Wallet has no tNight. Fund it from the faucet to send transactions:');
      console.log(`     ${networkConfig.faucet}`);
      console.log(`     Wallet address: ${address}\n`);
    }

    console.log('  Connecting to contract...');
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      // Note: no initialPrivateState here — findDeployedContract would
      // OVERWRITE the persisted wallet document every time it runs. The
      // deploy seeded the state; option 1 replaces the document.
      privateStateId: PRIVATE_STATE_ID,
    });

    console.log('  ✅ Connected!\n');

    let running = true;
    while (running) {
      console.log('─── Menu ───────────────────────────────────────────────────────');
      console.log('  1. Set wallet document (content file + key)');
      console.log('  2. Store document (public metadata, content stays private)');
      console.log('  3. Prove knowledge of document');
      console.log('  4. Refuse corruption (record an alarm)');
      console.log('  5. Check grant (public lookup)');
      console.log('  6. List documents (public ledger)');
      console.log('  7. Check wallet balance');
      console.log('  8. Exit\n');

      const choice = await ask('  Your choice: ');

      switch (choice.trim()) {
        case '1': {
          const contentFile = await ask('  Path to document file: ');
          if (!fs.existsSync(contentFile)) {
            console.log(`\n  ❌ File not found: ${contentFile}\n`);
            break;
          }
          const raw = fs.readFileSync(contentFile);
          if (raw.length > 256) {
            console.log(`\n  ❌ File too large (${raw.length} bytes; max 256).\n`);
            break;
          }
          const secretHex = await ask('  Owner private key (64 hex chars, or empty for random): ');
          const secret = secretHex.trim()
            ? pad32(secretHex.trim())
            : new Uint8Array(32).fill(0x42);
          providers.privateStateProvider.setContractAddress(deployment.address as any);
          await providers.privateStateProvider.set(PRIVATE_STATE_ID, {
            documentContent: pad256(raw.toString('utf8')),
            ownerPrivateKey: secret,
          });
          console.log('\n  ✅ Wallet document set. Use option 2 to store it.\n');
          break;
        }

        case '2': {
          const title = await ask('  Title: ');
          const category = await ask('  Category: ');
          const refHex = await ask('  Encrypted payload reference (64 hex chars, or empty): ');
          const keyIdHex = await ask('  Payload key id (64 hex chars, or empty): ');
          const cipher = await ask('  Cipher name (e.g. AES-256-GCM): ');
          const timestamp = BigInt(Math.floor(Date.now() / 1000));

          console.log('\n  Submitting transaction (this may take 30-60 seconds)...');
          try {
            const tx = await deployed.callTx.storeDocument(
              title,
              category,
              timestamp,
              refHex.trim() ? pad32(refHex.trim()) : new Uint8Array(32),
              keyIdHex.trim() ? pad32(keyIdHex.trim()) : new Uint8Array(32),
              cipher || 'none',
            );
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            const ledgerState = contractState ? DocStore.ledger(contractState.data) : null;
            console.log(`\n  ✅ Document stored: "${title}"`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}`);
            if (ledgerState) console.log(`  Documents on-chain: ${ledgerState.documents.size().toString()}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '3': {
          const idHex = await ask('  Document id (64 hex chars, or empty to use wallet document): ');
          console.log('\n  Proving knowledge of document content (ZK, content never revealed)...');
          try {
            let documentId: Uint8Array;
            if (idHex.trim()) {
              documentId = pad32(idHex.trim());
            } else {
              const ps = await providers.privateStateProvider.get(PRIVATE_STATE_ID);
              const content = (ps as any).documentContent as Uint8Array;
              const hash = await deployed.callTx.computeHash?.(content) ?? (await pureHash(content));
              documentId = hash;
            }
            const tx = await deployed.callTx.proveKnowledge(documentId);
            console.log(`\n  ✅ Knowledge proven for ${toHex(documentId)}`);
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '4': {
          const idHex = await ask('  Document id (64 hex chars): ');
          const ownerHex = await ask('  Claimed owner public key (64 hex chars): ');
          const timestamp = BigInt(Math.floor(Date.now() / 1000));
          console.log('\n  Recording refusal (proves you are the owner, ZK)...');
          try {
            const tx = await deployed.callTx.refuseCorruption(pad32(idHex.trim()), pad32(ownerHex.trim()), timestamp);
            console.log(`\n  ✅ Refusal recorded`);
            console.log(`  Transaction ID: ${tx.public.txId}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '5': {
          const idHex = await ask('  Document id (64 hex chars): ');
          const granteeHex = await ask('  Grantee public key (64 hex chars): ');
          try {
            const ledgerState = await queryLedger(providers, deployment.address);
            if (!ledgerState) {
              console.log('\n  📋 No contract state found.\n');
              break;
            }
            const docId = pad32(idHex.trim());
            const grantee = pad32(granteeHex.trim());
            const doc = ledgerState.documents.member(docId)
              ? ledgerState.documents.lookup(docId)
              : null;
            const grantKey = DocStore.pureCircuits.grantKey(docId, grantee);
            const granted = ledgerState.grants.member(grantKey)
              ? ledgerState.grants.lookup(grantKey)
              : 0n;
            console.log(`\n  Grant timestamp: ${granted.toString()} (0 = no grant)`);
            console.log(`  Document title:  ${doc ? doc.title : '(not on chain)'}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '6': {
          console.log('\n  Reading public ledger from indexer...');
          try {
            const ledgerState = await queryLedger(providers, deployment.address);
            if (!ledgerState) {
              console.log('\n  📋 No contract state found (no documents yet).\n');
              break;
            }
            const count = ledgerState.documents.size();
            console.log(`\n  Documents on-chain: ${count.toString()}`);
            console.log('  (Public metadata only — content bytes never appear)\n');
            const ps = await providers.privateStateProvider.get(PRIVATE_STATE_ID).catch(() => null);
            const walletDoc = ps as any;
            if (walletDoc?.documentContent) {
              const docId = await pureHash(walletDoc.documentContent);
              console.log(`  Wallet document id: ${toHex(docId)}`);
              const known = ledgerState.documents.member(docId);
              console.log(`  Is it on-chain?    ${known ? 'YES' : 'no'}`);
            }
            console.log('');
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '7': {
          console.log('\n  Checking balance...');
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST: ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '8':
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;

        default:
          console.log('\n  ❌ Invalid choice. Please enter 1-8.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    rl?.close();
  }
}

async function pureHash(content: Uint8Array): Promise<Uint8Array> {
  const { pureCircuits } = await import(pathToFileURL(contractPath).href);
  return pureCircuits.computeHash(content);
}

main().catch(console.error);
