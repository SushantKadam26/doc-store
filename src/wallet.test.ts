import { describe, it, expect } from 'vitest';
import { loadWalletState, saveWalletState, clearWalletState, WALLET_STATE_DIR, WALLET_STATE_VERSION, CHILD_KINDS } from './wallet-state.ts';

describe('Wallet state persistence', () => {
  it('should define wallet state constants', () => {
    expect(WALLET_STATE_DIR).toBe('.midnight-wallet-state');
    expect(WALLET_STATE_VERSION).toBe(1);
  });

  it('should define child kinds', () => {
    expect(CHILD_KINDS).toEqual(['shielded', 'unshielded', 'dust']);
  });
});
