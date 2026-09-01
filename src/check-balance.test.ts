import { describe, it, expect } from 'vitest';
import { resolveNetwork } from './network.ts';

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
