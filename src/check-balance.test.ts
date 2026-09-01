/**
 * Unit tests for check-balance.ts
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolveNetwork, getOrCreateWallet } from './network.ts';

describe('Network Resolution', () => {
  it('should resolve undeployed network by default', () => {
    const { network } = resolveNetwork();
    expect(network).toBe('undeployed');
  });

  it('should resolve preview network with flag', () => {
    const { network } = resolveNetwork({ argv: ['--network', 'preview'] });
    expect(network).toBe('preview');
  });

  it('should resolve preprod network with flag', () => {
    const { network } = resolveNetwork({ argv: ['--network', 'preprod'] });
    expect(network).toBe('preprod');
  });
});

describe('Wallet Creation', () => {
  it('should create wallet on undeployed network', () => {
    const { network, config } = resolveNetwork({ argv: [] });
    const wallet = getOrCreateWallet(network, { networkConfig: config });
    expect(wallet.seed).toBeDefined();
  });
});
