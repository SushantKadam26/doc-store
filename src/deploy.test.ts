/**
 * Unit tests for deploy.ts
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolveNetwork, getOrCreateWallet } from './network.ts';

describe('Deploy preparation', () => {
  it('should resolve network correctly for predeploy steps', () => {
    const { network, config } = resolveNetwork({ argv: ['--network', 'preview'] });
    expect(network).toBe('preview');
    expect(config.networkId).toBe('preview');
  });

  it('should create wallet with correct network', () => {
    const { network, config } = resolveNetwork({ argv: [] });
    const wallet = getOrCreateWallet(network, { networkConfig: config });
    expect(wallet.seed).toBeDefined();
  });
});
