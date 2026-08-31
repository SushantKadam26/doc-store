import {
  ZKConfigProvider,
  createProverKey,
  createVerifierKey,
  createZKIR,
  type ProverKey,
  type VerifierKey,
  type ZKIR,
} from '@midnight-ntwrk/midnight-js-types';

/**
 * Browser-compatible ZKConfigProvider that fetches .prover, .verifier, and .bzkir
 * static files over HTTP using the browser's standard fetch API.
 */
export class FetchZkConfigProvider extends ZKConfigProvider<string> {
  private baseUrl: string;
  private fetchFn: typeof fetch;

  /**
   * @param baseUrl Base URL path where keys/ and zkir/ directories are hosted (e.g. '/contracts/managed/DocStore')
   * @param fetchFn Optional custom fetch function, defaults to window.fetch
   */
  constructor(baseUrl: string, fetchFn: typeof fetch = fetch.bind(window)) {
    super();
    // Normalize trailing slashes
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.fetchFn = fetchFn;
  }

  private async fetchFile(subDir: string, circuitId: string, ext: string): Promise<Uint8Array> {
    const url = `${this.baseUrl}/${subDir}/${circuitId}${ext}`;
    const response = await this.fetchFn(url);
    if (!response.ok) {
      throw new Error(`Failed to load ZK artifact from ${url} (HTTP ${response.status}: ${response.statusText})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  /**
   * Retrieves the prover key for the given circuit ID.
   */
  async getProverKey(circuitId: string): Promise<ProverKey> {
    const bytes = await this.fetchFile('keys', circuitId, '.prover');
    return createProverKey(bytes);
  }

  /**
   * Retrieves the verifier key for the given circuit ID.
   */
  async getVerifierKey(circuitId: string): Promise<VerifierKey> {
    const bytes = await this.fetchFile('keys', circuitId, '.verifier');
    return createVerifierKey(bytes);
  }

  /**
   * Retrieves the zero-knowledge intermediate representation (.bzkir) for the given circuit ID.
   */
  async getZKIR(circuitId: string): Promise<ZKIR> {
    const bytes = await this.fetchFile('zkir', circuitId, '.bzkir');
    return createZKIR(bytes);
  }
}
