/**
 * Unit tests for 1AM Wallet connector
 */
import { describe, it, expect } from 'vitest';
import { resolveNetwork } from '../network.ts';

describe('1AM Connector', () => {
  it('should resolve network identifiers', () => {
    expect(isNetworkId('undeployed')).toBe(true);
    expect(isNetworkId('preview')).toBe(true);
    expect(isNetworkId('preprod')).toBe(true);
  });

  it('should handle network flag parsing', () => {
    const result = parseNetworkFlag(['node', 'script.js', '--network', 'preview']);
    expect(result).toBe('preview');
  });
});
