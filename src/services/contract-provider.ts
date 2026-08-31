import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { FetchZkConfigProvider } from './fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { findDeployedContract, deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';

export const PRIVATE_STATE_ID = 'docStorePrivateState';

/**
 * In-browser PrivateStateProvider that securely holds contract private state
 * in memory / session storage without exposing it outside the application.
 */
export class BrowserPrivateStateProvider implements PrivateStateProvider<any> {
  private storage: Map<string, any> = new Map();
  private contractAddress: string | null = null;

  setContractAddress(address: any): void {
    this.contractAddress = typeof address === 'string' ? address : String(address);
  }

  async get(privateStateId: string): Promise<any | null> {
    const key = `${this.contractAddress || 'default'}:${privateStateId}`;
    return this.storage.get(key) ?? null;
  }

  async set(privateStateId: string, state: any): Promise<void> {
    const key = `${this.contractAddress || 'default'}:${privateStateId}`;
    this.storage.set(key, state);
  }

  async remove(privateStateId: string): Promise<void> {
    const key = `${this.contractAddress || 'default'}:${privateStateId}`;
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

/**
 * Build Midnight.js providers using the 1AM connected wallet and browser environment.
 */
export async function buildMidnightProviders(
  connectedAPI: ConnectedAPI,
  zkArtifactsUrl = '/contracts/managed/DocStore'
) {
  const config = (await connectedAPI.getConfiguration?.()) || {
    indexerUri: 'http://127.0.0.1:8088/api/v4/graphql',
    indexerWsUri: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
    networkId: 'undeployed',
  };

  try {
    setNetworkId(config.networkId as any);
  } catch (e) {
    console.warn('Network ID already set or error setting network ID:', e);
  }

  const zkConfigProvider = new FetchZkConfigProvider(zkArtifactsUrl);
  const publicDataProvider = indexerPublicDataProvider(config.indexerUri, config.indexerWsUri);
  const privateStateProvider = new BrowserPrivateStateProvider();

  // Prover provider: prefer wallet's proving provider if available, otherwise HTTP proof server
  let proofProvider: any;
  try {
    if (typeof connectedAPI.getProvingProvider === 'function') {
      proofProvider = await connectedAPI.getProvingProvider(zkConfigProvider.asKeyMaterialProvider());
    }
  } catch (e) {
    console.warn('Could not acquire proving provider from wallet, falling back to HTTP proof server:', e);
  }

  if (!proofProvider) {
    // Default local proof server
    proofProvider = httpClientProofProvider(
      config.proverServerUri || 'http://127.0.0.1:6300',
      zkConfigProvider
    );
  }

  // Wallet provider bridge for Midnight.js contract transactions
  const walletProvider = {
    async getCoinPublicKey() {
      const addresses = await connectedAPI.getShieldedAddresses();
      return addresses.shieldedCoinPublicKey;
    },
    async getEncryptionPublicKey() {
      const addresses = await connectedAPI.getShieldedAddresses();
      return addresses.shieldedEncryptionPublicKey;
    },
    async balanceTx(tx: any) {
      if (typeof connectedAPI.balanceUnsealedTransaction === 'function') {
        const result = await connectedAPI.balanceUnsealedTransaction(tx);
        return result.tx;
      }
      return tx;
    },
    async submitTx(tx: any) {
      return await connectedAPI.submitTransaction(tx);
    },
  };

  return {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider: walletProvider,
  };
}

/**
 * Instantiate a deployed DocStore contract instance
 */
export async function getDeployedDocStoreContract(
  contractAddress: string,
  contractModule: any,
  connectedAPI: ConnectedAPI,
  zkArtifactsUrl = '/contracts/managed/DocStore'
) {
  const providers = await buildMidnightProviders(connectedAPI, zkArtifactsUrl);
  providers.privateStateProvider.setContractAddress(contractAddress);

  const compiledContract = CompiledContract.make('DocStore', contractModule.Contract).pipe(
    CompiledContract.withWitnesses({
      documentContent: (context: any) => [
        context.privateState,
        context.privateState?.documentContent || new Uint8Array(256),
      ],
      ownerPrivateKey: (context: any) => [
        context.privateState,
        context.privateState?.ownerPrivateKey || new Uint8Array(32),
      ],
    } as never)
  );

  const contractInstance = await findDeployedContract(providers, {
    compiledContract: compiledContract as any,
    contractAddress,
    privateStateId: PRIVATE_STATE_ID,
  });

  return { contractInstance, providers };
}

/**
 * Deploy a new DocStore contract using the connected 1AM wallet
 */
export async function deployDocStoreContract(
  contractModule: any,
  connectedAPI: ConnectedAPI,
  zkArtifactsUrl = '/contracts/managed/DocStore'
) {
  const providers = await buildMidnightProviders(connectedAPI, zkArtifactsUrl);

  const compiledContract = CompiledContract.make('DocStore', contractModule.Contract).pipe(
    CompiledContract.withWitnesses({
      documentContent: (context: any) => [
        context.privateState,
        context.privateState?.documentContent || new Uint8Array(256),
      ],
      ownerPrivateKey: (context: any) => [
        context.privateState,
        context.privateState?.ownerPrivateKey || new Uint8Array(32),
      ],
    } as never)
  );

  const deployed = await deployContract(providers, {
    compiledContract: compiledContract as any,
    args: [],
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {
      documentContent: new Uint8Array(256),
      ownerPrivateKey: new Uint8Array(32),
    },
  });

  return { deployed, providers };
}