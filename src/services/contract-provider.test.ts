/**
 * Unit tests for contract provider service
 */
import { describe, it, expect } from 'vitest';
import { resolveNetwork } from '../network.ts';

describe('Contract Provider', () => {
  it('should resolve different network configurations', () => {
    const undeployed = resolveNetwork({ argv: [] });
    expect(undeployed.network).toBe('undeployed');
    
    const preview = resolveNetwork({ argv: ['--network', 'preview'] });
    expect(preview.network).toBe('preview');
    
    const preprod = resolveNetwork({ argv: ['--network', 'preprod'] });
    expect(preprod.network).toBe('preprod');
  });

  it('should have valid network IDs', () => {
    expect(isNetworkId('undeployed')).toBe(true);
    expect(isNetworkId('preview')).toBe(true);
    expect(isNetworkId('preprod')).toBe(true);
    expect(isNetworkId('mainnet')).toBe(false);
  });
});
