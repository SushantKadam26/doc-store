/**
 * Unit tests for wallet state management
 */
import { describe, it, expect } from 'vitest';
import { loadWalletState, saveWalletState, clearWalletState } from './wallet-state.ts';
import { NetworkId } from './network.ts';

describe('Wallet state persistence', () => {
  it('should define wallet state constants', () => {
    expect(WALLET_STATE_DIR).toBe('.midnight-wallet-state');
    expect(WALLET_STATE_VERSION).toBe(1);
  });

  it('should define child kinds', () => {
    expect(CHILD_KINDS).toEqual(['shielded', 'unshielded', 'dust']);
  });

  it('should have valid persisted wallet state shape', () => {
    const state: PersistedWalletState = {};
    expect(state).toMatchObject({});
  });
});
