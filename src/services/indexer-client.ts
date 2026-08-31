/**
 * Indexer GraphQL client for querying on-chain contract state and document records
 */

export interface OnChainDocument {
  documentId: string;
  owner: string;
  title: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  payloadEnvelope?: {
    encryptedRef: string;
    payloadKeyId: string;
    cipher: string;
    version: number;
  };
}

export interface NetworkHealth {
  nodeOnline: boolean;
  indexerOnline: boolean;
  proofServerOnline: boolean;
  currentBlockHeight?: number;
  networkId: string;
}

/**
 * Query the contract state from the Midnight indexer
 */
export async function fetchContractStateFromIndexer(
  indexerUrl: string,
  contractAddress: string
): Promise<string | null> {
  const query = `
    query GetContractState($address: String!) {
      contractState(contractAddress: $address) {
        data
      }
    }
  `;

  try {
    const response = await fetch(indexerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { address: contractAddress } }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json.data?.contractState?.data || null;
  } catch (err) {
    console.warn('Failed to query contract state from indexer:', err);
    return null;
  }
}

/**
 * Check connectivity of Node, Indexer, and Proof Server
 */
export async function checkNetworkHealth(
  indexerUrl = 'http://127.0.0.1:8088/api/v4/graphql',
  proofServerUrl = 'http://127.0.0.1:6300',
  networkId = 'undeployed'
): Promise<NetworkHealth> {
  let indexerOnline = false;
  let currentBlockHeight: number | undefined;

  try {
    const query = `
      query GetLatestBlock {
        blocks(first: 1, orderBy: [HEIGHT_DESC]) {
          nodes {
            height
          }
        }
      }
    `;
    const res = await fetch(indexerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      indexerOnline = true;
      const data = await res.json();
      currentBlockHeight = data.data?.blocks?.nodes?.[0]?.height;
    }
  } catch {
    indexerOnline = false;
  }

  let proofServerOnline = false;
  try {
    const res = await fetch(proofServerUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    proofServerOnline = res.status < 500;
  } catch (err: any) {
    // Some proof servers return 404 or method not allowed on GET root, which still means they are alive
    if (err?.name !== 'AbortError' && err?.code !== 'ECONNREFUSED') {
      proofServerOnline = true;
    }
  }

  // Node is online if indexer is producing/indexing blocks
  const nodeOnline = indexerOnline;

  return {
    nodeOnline,
    indexerOnline,
    proofServerOnline,
    currentBlockHeight,
    networkId,
  };
}

/**
 * Format bytes array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}
