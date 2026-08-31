import React, { useState, useEffect } from 'react';
import { connect1AMWallet, WalletState } from '../services/1am-wallet';

export const OneAMWalletConnector: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await connect1AMWallet('preprod');
      setWallet(state);
    } catch (err: any) {
      setError(err.message || 'Failed to connect 1AM wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>1AM Wallet Connection</h3>
      {!wallet?.isConnected ? (
        <button onClick={handleConnect} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect 1AM Wallet'}
        </button>
      ) : (
        <div>
          <p><strong>Network:</strong> {wallet.networkId}</p>
          <p><strong>Unshielded Address:</strong> {wallet.unshieldedAddress}</p>
          <p><strong>Shielded Address:</strong> {wallet.shieldedAddress}</p>
          <p><strong>tNIGHT Balance:</strong> {wallet.nightBalance.toString()}</p>
          <p><strong>tDUST Balance:</strong> {wallet.dustBalance.balance.toString()} / {wallet.dustBalance.cap.toString()}</p>
          <button onClick={() => setWallet(null)} style={{ marginTop: '1rem' }}>
            Disconnect
          </button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};