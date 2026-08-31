import type {
  DAppConnectorWalletAPI,
  InitialAPI,
  ConnectedAPI,
} from '@midnight-ntwrk/dapp-connector-api';

export interface WalletState {
  isConnected: boolean;
  walletName: string;
  networkId: string;
  shieldedAddress: string | null;
  unshieldedAddress: string | null;
  dustAddress: string | null;
  shieldedCoinPublicKey?: string;
  shieldedEncryptionPublicKey?: string;
  nightBalance: bigint;
  dustBalance: { balance: bigint; cap: bigint };
  api: ConnectedAPI | null;
  configuration?: {
    indexerUri: string;
    indexerWsUri: string;
    substrateNodeUri: string;
    networkId: string;
  };
}

/**
 * Detect available Midnight wallets on window.midnight.
 * Prefers 1AM wallet if present.
 */
export async function detect1AMWallet(timeoutMs = 3000): Promise<{ provider: InitialAPI; key: string }> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const midnight = (window as any).midnight;
    if (midnight && typeof midnight === 'object') {
      // Check for 1AM wallet explicitly
      if (midnight['1am']) {
        return { provider: midnight['1am'], key: '1am' };
      }
      if (midnight['1AM'] || midnight['one-am'] || midnight['oneAM']) {
        const key = midnight['1AM'] ? '1AM' : midnight['one-am'] ? 'one-am' : 'oneAM';
        return { provider: midnight[key], key };
      }
      // Check any available midnight wallet
      const keys = Object.keys(midnight);
      if (keys.length > 0) {
        const firstKey = keys[0];
        if (midnight[firstKey]?.connect) {
          return { provider: midnight[firstKey], key: firstKey };
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(
    '1AM Wallet extension not detected. Please ensure 1AM Wallet is installed and enabled in your Chrome browser.'
  );
}

/**
 * Check if 1AM or any Midnight wallet extension is present in window.midnight
 */
export function is1AMInstalled(): boolean {
  const midnight = (window as any).midnight;
  if (!midnight || typeof midnight !== 'object') return false;
  return Boolean(midnight['1am'] || midnight['1AM'] || midnight['one-am'] || Object.keys(midnight).length > 0);
}

/**
 * Connect to 1AM wallet and retrieve account addresses, network config, and balances.
 */
export async function connect1AMWallet(
  networkId: 'undeployed' | 'preview' | 'preprod' = 'undeployed'
): Promise<WalletState> {
  const { provider, key } = await detect1AMWallet();
  const walletName = provider.name || (key === '1am' ? '1AM Wallet' : key);

  // Connect to wallet for specified network
  const connectedAPI = await provider.connect(networkId);

  let config: any = null;
  try {
    if (typeof connectedAPI.getConfiguration === 'function') {
      config = await connectedAPI.getConfiguration();
    }
  } catch (e) {
    console.warn('Failed to retrieve wallet configuration:', e);
  }

  // Retrieve addresses
  let shieldedAddress: string | null = null;
  let shieldedCoinPublicKey: string | undefined;
  let shieldedEncryptionPublicKey: string | undefined;
  try {
    const shielded = await connectedAPI.getShieldedAddresses();
    shieldedAddress = shielded?.shieldedAddress || null;
    shieldedCoinPublicKey = shielded?.shieldedCoinPublicKey;
    shieldedEncryptionPublicKey = shielded?.shieldedEncryptionPublicKey;
  } catch (e) {
    console.warn('Could not fetch shielded address:', e);
  }

  let unshieldedAddress: string | null = null;
  try {
    const unshielded = await connectedAPI.getUnshieldedAddress();
    unshieldedAddress = unshielded?.unshieldedAddress || null;
  } catch (e) {
    console.warn('Could not fetch unshielded address:', e);
  }

  let dustAddress: string | null = null;
  try {
    const dust = await connectedAPI.getDustAddress();
    dustAddress = dust?.dustAddress || null;
  } catch (e) {
    console.warn('Could not fetch dust address:', e);
  }

  // Retrieve balances
  let nightBalance = 0n;
  try {
    const unshieldedBalances = await connectedAPI.getUnshieldedBalances();
    if (unshieldedBalances) {
      nightBalance =
        unshieldedBalances['NIGHT'] ??
        unshieldedBalances['tNIGHT'] ??
        Object.values(unshieldedBalances)[0] ??
        0n;
    }
  } catch (e) {
    console.warn('Could not fetch unshielded balances:', e);
  }

  let dustBalance = { balance: 0n, cap: 0n };
  try {
    dustBalance = await connectedAPI.getDustBalance();
  } catch (e) {
    console.warn('Could not fetch dust balance:', e);
  }

  return {
    isConnected: true,
    walletName,
    networkId: config?.networkId || networkId,
    shieldedAddress,
    unshieldedAddress,
    dustAddress,
    shieldedCoinPublicKey,
    shieldedEncryptionPublicKey,
    nightBalance,
    dustBalance,
    api: connectedAPI,
    configuration: config,
  };
}

/**
 * Refresh balances for an active wallet connection
 */
export async function refreshWalletBalances(api: ConnectedAPI): Promise<{
  nightBalance: bigint;
  dustBalance: { balance: bigint; cap: bigint };
}> {
  let nightBalance = 0n;
  try {
    const unshieldedBalances = await api.getUnshieldedBalances();
    if (unshieldedBalances) {
      nightBalance =
        unshieldedBalances['NIGHT'] ??
        unshieldedBalances['tNIGHT'] ??
        Object.values(unshieldedBalances)[0] ??
        0n;
    }
  } catch (e) {
    console.warn('Could not fetch unshielded balances:', e);
  }

  let dustBalance = { balance: 0n, cap: 0n };
  try {
    dustBalance = await api.getDustBalance();
  } catch (e) {
    console.warn('Could not fetch dust balance:', e);
  }

  return { nightBalance, dustBalance };
}