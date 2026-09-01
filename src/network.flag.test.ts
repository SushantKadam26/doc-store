import { describe, it, expect } from 'vitest';
import { resolveNetwork, parseNetworkFlag, isNetworkId } from './network.ts';

describe('parseNetworkFlag', () => {
  it('should parse --network flag', () => {
    const result = parseNetworkFlag(['node', 'script.js', '--network', 'preview']);
    expect(result).toBe('preview');
  });

  it('should parse --network=preview format', () => {
    const result = parseNetworkFlag(['node', 'script.js', '--network=preprod']);
    expect(result).toBe('preprod');
  });

  it('should return null when no flag provided', () => {
    const result = parseNetworkFlag(['node', 'script.js']);
    expect(result).toBeNull();
  });
});

describe('isNetworkId', () => {
  it('should validate known network IDs', () => {
    expect(isNetworkId('undeployed')).toBe(true);
    expect(isNetworkId('preview')).toBe(true);
    expect(isNetworkId('preprod')).toBe(true);
  });

  it('should reject unknown network IDs', () => {
    expect(isNetworkId('mainnet')).toBe(false);
    expect(isNetworkId('')).toBe(false);
  });
});
