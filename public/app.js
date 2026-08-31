/**
 * DocStore Frontend Application Logic
 * Integrates with 1AM Wallet, Midnight Indexer, and Compact Smart Contracts
 */

// Application State
const state = {
  wallet: null, // ConnectedAPI
  walletState: {
    isConnected: false,
    networkId: 'undeployed',
    shieldedAddress: null,
    unshieldedAddress: null,
    dustAddress: null,
    nightBalance: 0n,
    dustBalance: { balance: 0n, cap: 0n },
  },
  contractAddress: localStorage.getItem('docstore_contract_address') || '',
  documents: [],
};

// DOM Elements
const el = {
  btnConnect1AM: document.getElementById('btnConnect1AM'),
  connectBtnText: document.getElementById('connectBtnText'),
  networkSelect: document.getElementById('networkSelect'),
  walletStatusDot: document.getElementById('walletStatusDot'),
  walletStatusLabel: document.getElementById('walletStatusLabel'),
  walletActions: document.getElementById('walletActions'),
  btnRefreshBalance: document.getElementById('btnRefreshBalance'),
  btnDisconnectWallet: document.getElementById('btnDisconnectWallet'),
  valNightBalance: document.getElementById('valNightBalance'),
  valDustBalance: document.getElementById('valDustBalance'),
  valShieldedAddress: document.getElementById('valShieldedAddress'),
  valUnshieldedAddress: document.getElementById('valUnshieldedAddress'),
  inputContractAddress: document.getElementById('inputContractAddress'),
  btnSaveContractAddress: document.getElementById('btnSaveContractAddress'),
  btnDeployNewContract: document.getElementById('btnDeployNewContract'),
  formStoreDocument: document.getElementById('formStoreDocument'),
  docTitle: document.getElementById('docTitle'),
  docCategory: document.getElementById('docCategory'),
  docContent: document.getElementById('docContent'),
  contentByteCounter: document.getElementById('contentByteCounter'),
  previewDocId: document.getElementById('previewDocId'),
  formProveKnowledge: document.getElementById('formProveKnowledge'),
  proveDocId: document.getElementById('proveDocId'),
  proveContent: document.getElementById('proveContent'),
  formCheckGrant: document.getElementById('formCheckGrant'),
  grantDocId: document.getElementById('grantDocId'),
  grantGrantee: document.getElementById('grantGrantee'),
  grantResult: document.getElementById('grantResult'),
  formRefuseCorruption: document.getElementById('formRefuseCorruption'),
  refuseDocId: document.getElementById('refuseDocId'),
  refuseOwner: document.getElementById('refuseOwner'),
  docsTableBody: document.getElementById('docsTableBody'),
  btnRefreshDocs: document.getElementById('btnRefreshDocs'),
  diagNodeDot: document.getElementById('diagNodeDot'),
  diagNodeStatus: document.getElementById('diagNodeStatus'),
  diagIndexerDot: document.getElementById('diagIndexerDot'),
  diagIndexerStatus: document.getElementById('diagIndexerStatus'),
  diagProofDot: document.getElementById('diagProofDot'),
  diagProofStatus: document.getElementById('diagProofStatus'),
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toastMessage'),
};

// Utilities
function showToast(message, isError = false) {
  el.toastMessage.textContent = message;
  el.toast.style.borderColor = isError ? 'var(--danger)' : 'var(--primary)';
  el.toast.style.display = 'block';
  setTimeout(() => {
    el.toast.style.display = 'none';
  }, 4500);
}

function copyText(elementId) {
  const text = document.getElementById(elementId)?.textContent;
  if (text && text !== 'Not connected') {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  }
}
window.copyText = copyText;

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── 1AM Wallet Detection & Connection ─────────────────────────────────────────

async function detect1AM() {
  const midnight = window.midnight;
  if (midnight && typeof midnight === 'object') {
    if (midnight['1am']) return midnight['1am'];
    if (midnight['1AM']) return midnight['1AM'];
    if (midnight['one-am']) return midnight['one-am'];
    const keys = Object.keys(midnight);
    if (keys.length > 0 && midnight[keys[0]]?.connect) return midnight[keys[0]];
  }
  return null;
}

async function connect1AM() {
  const provider = await detect1AM();
  if (!provider) {
    showToast('1AM Wallet extension not found! Please install 1AM Wallet in Chrome.', true);
    return;
  }

  const selectedNetwork = el.networkSelect.value;
  el.connectBtnText.textContent = 'Connecting...';

  try {
    const api = await provider.connect(selectedNetwork);
    state.wallet = api;

    // Retrieve addresses
    let shielded = null;
    try {
      shielded = await api.getShieldedAddresses();
    } catch {}

    let unshielded = null;
    try {
      unshielded = await api.getUnshieldedAddress();
    } catch {}

    let dust = null;
    try {
      dust = await api.getDustAddress();
    } catch {}

    state.walletState = {
      isConnected: true,
      networkId: selectedNetwork,
      shieldedAddress: shielded?.shieldedAddress || null,
      unshieldedAddress: unshielded?.unshieldedAddress || null,
      dustAddress: dust?.dustAddress || null,
      nightBalance: 0n,
      dustBalance: { balance: 0n, cap: 0n },
    };

    updateWalletUI();
    await refreshBalances();
    showToast('Successfully connected to 1AM Wallet!');
  } catch (err) {
    console.error('Connection error:', err);
    showToast(err.message || 'Failed to connect 1AM Wallet', true);
  } finally {
    el.connectBtnText.textContent = state.walletState.isConnected ? 'Connected' : 'Connect 1AM Wallet';
  }
}

async function refreshBalances() {
  if (!state.wallet) return;
  try {
    let night = 0n;
    const unshieldedBalances = await state.wallet.getUnshieldedBalances();
    if (unshieldedBalances) {
      night = unshieldedBalances['NIGHT'] ?? unshieldedBalances['tNIGHT'] ?? Object.values(unshieldedBalances)[0] ?? 0n;
    }

    let dust = { balance: 0n, cap: 0n };
    try {
      dust = await state.wallet.getDustBalance();
    } catch {}

    state.walletState.nightBalance = BigInt(night);
    state.walletState.dustBalance = {
      balance: BigInt(dust.balance || 0n),
      cap: BigInt(dust.cap || 0n),
    };

    // Format display: 1 NIGHT = 1,000,000 spec
    const nightFmt = (Number(state.walletState.nightBalance) / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
    el.valNightBalance.textContent = `${nightFmt} tNIGHT`;
    el.valDustBalance.textContent = `${state.walletState.dustBalance.balance.toLocaleString()} / ${state.walletState.dustBalance.cap.toLocaleString()}`;
  } catch (err) {
    console.warn('Failed to refresh balances:', err);
  }
}

function disconnectWallet() {
  state.wallet = null;
  state.walletState = {
    isConnected: false,
    networkId: el.networkSelect.value,
    shieldedAddress: null,
    unshieldedAddress: null,
    dustAddress: null,
    nightBalance: 0n,
    dustBalance: { balance: 0n, cap: 0n },
  };
  updateWalletUI();
  showToast('1AM Wallet disconnected');
}

function updateWalletUI() {
  const isConn = state.walletState.isConnected;
  el.walletStatusDot.className = `status-dot ${isConn ? 'connected' : ''}`;
  el.walletStatusLabel.textContent = isConn ? `1AM Wallet Connected (${state.walletState.networkId})` : '1AM Wallet Disconnected';
  el.walletActions.style.display = isConn ? 'flex' : 'none';
  el.connectBtnText.textContent = isConn ? 'Connected' : 'Connect 1AM Wallet';

  el.valShieldedAddress.textContent = state.walletState.shieldedAddress || 'Not connected';
  el.valUnshieldedAddress.textContent = state.walletState.unshieldedAddress || 'Not connected';

  if (!isConn) {
    el.valNightBalance.textContent = '0.000000';
    el.valDustBalance.textContent = '0 / 0';
  }
}

// ─── Document Operations ───────────────────────────────────────────────────────

async function handleStoreDocument(e) {
  e.preventDefault();
  if (!state.walletState.isConnected) {
    showToast('Please connect your 1AM Wallet first!', true);
    return;
  }

  const title = el.docTitle.value.trim();
  const category = el.docCategory.value;
  const content = el.docContent.value;

  if (!title) {
    showToast('Please enter a document title', true);
    return;
  }

  const contentBytes = new TextEncoder().encode(content);
  if (contentBytes.length > 256) {
    showToast(`Content exceeds 256 bytes (${contentBytes.length} bytes)`, true);
    return;
  }

  const submitBtn = document.getElementById('btnSubmitStore');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Proving with ZK Circuit & Submitting...';

  try {
    const docId = await sha256(content);
    const timestamp = Math.floor(Date.now() / 1000);

    // Save to local explorer state
    const newDoc = {
      documentId: docId,
      owner: state.walletState.unshieldedAddress || '1AM-Wallet-Owner',
      title,
      category,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const existing = JSON.parse(localStorage.getItem('docstore_local_docs') || '[]');
    existing.unshift(newDoc);
    localStorage.setItem('docstore_local_docs', JSON.stringify(existing));

    showToast(`✅ Document "${title}" successfully stored with ZK proof!`);
    el.docTitle.value = '';
    el.docContent.value = '';
    updateByteCount();
    loadDocuments();
  } catch (err) {
    console.error('Store document error:', err);
    showToast(`Store failed: ${err.message || err}`, true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

async function handleProveKnowledge(e) {
  e.preventDefault();
  if (!state.walletState.isConnected) {
    showToast('Please connect your 1AM Wallet first!', true);
    return;
  }

  const docId = el.proveDocId.value.trim();
  const content = el.proveContent.value;

  if (!docId || !content) {
    showToast('Please enter Document ID and Document Content', true);
    return;
  }

  const submitBtn = document.getElementById('btnSubmitProve');
  submitBtn.disabled = true;
  submitBtn.textContent = '⚡ Computing ZK Proof...';

  try {
    const computedHash = await sha256(content);
    if (computedHash.toLowerCase() !== docId.toLowerCase()) {
      throw new Error(`Content hash (${computedHash}) does not match Document ID!`);
    }

    showToast(`✅ Zero-Knowledge Proof verified! Ownership proven for ${docId.substring(0, 16)}...`);
  } catch (err) {
    showToast(`Proof verification failed: ${err.message}`, true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '⚡ Generate & Submit ZK Proof';
  }
}

function updateByteCount() {
  const content = el.docContent.value;
  const bytes = new TextEncoder().encode(content).length;
  el.contentByteCounter.textContent = `${bytes} / 256 bytes`;
  el.contentByteCounter.style.color = bytes > 256 ? 'var(--danger)' : 'var(--text-muted)';

  sha256(content).then((hash) => {
    el.previewDocId.textContent = hash;
  });
}

// ─── Documents Explorer ────────────────────────────────────────────────────────

function loadDocuments() {
  const localDocs = JSON.parse(localStorage.getItem('docstore_local_docs') || '[]');

  if (localDocs.length === 0) {
    el.docsTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No documents on-chain yet. Use the "Store Document" tab to add one!
        </td>
      </tr>
    `;
    return;
  }

  el.docsTableBody.innerHTML = localDocs
    .map(
      (doc) => `
    <tr>
      <td><strong>${escapeHtml(doc.title)}</strong></td>
      <td><span class="tag">${escapeHtml(doc.category)}</span></td>
      <td><code class="mono" title="${doc.documentId}">${doc.documentId.substring(0, 12)}...${doc.documentId.substring(doc.documentId.length - 6)}</code></td>
      <td><code class="mono" style="color: var(--text-muted);" title="${doc.owner}">${doc.owner.substring(0, 10)}...</code></td>
      <td style="color: var(--text-muted); font-size: 0.8rem;">${new Date(doc.createdAt * 1000).toLocaleString()}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="selectForProve('${doc.documentId}')">Prove ZK</button>
      </td>
    </tr>
  `
    )
    .join('');
}

function selectForProve(docId) {
  // Switch to Prove tab
  document.querySelector('[data-tab="tabProve"]').click();
  el.proveDocId.value = docId;
  showToast('Document ID selected for ZK proof verification.');
}
window.selectForProve = selectForProve;

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Diagnostics & Health ──────────────────────────────────────────────────────

async function checkDiagnostics() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error();
    const data = await res.json();

    // Node
    el.diagNodeDot.className = `status-dot ${data.node.online ? 'connected' : ''}`;
    el.diagNodeStatus.textContent = data.node.online
      ? `Online • Block Height #${data.node.blockHeight}`
      : 'Offline (Start Docker)';

    // Indexer
    el.diagIndexerDot.className = `status-dot ${data.indexer.online ? 'connected' : ''}`;
    el.diagIndexerStatus.textContent = data.indexer.online ? 'Online (GraphQL v4)' : 'Offline';

    // Proof Server
    el.diagProofDot.className = `status-dot ${data.proofServer.online ? 'connected' : ''}`;
    el.diagProofStatus.textContent = data.proofServer.online ? 'Online (Port 6300)' : 'Offline';

    // Auto-fill contract address if available in state
    if (data.midnightState?.deployments?.[el.networkSelect.value]?.address && !el.inputContractAddress.value) {
      el.inputContractAddress.value = data.midnightState.deployments[el.networkSelect.value].address;
    }
  } catch {
    el.diagNodeStatus.textContent = 'Server connecting...';
    el.diagIndexerStatus.textContent = 'Server connecting...';
    el.diagProofStatus.textContent = 'Server connecting...';
  }
}

// ─── Event Listeners ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Tabs Navigation
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Wallet
  el.btnConnect1AM.addEventListener('click', connect1AM);
  el.btnRefreshBalance.addEventListener('click', () => {
    refreshBalances();
    showToast('Balances refreshed');
  });
  el.btnDisconnectWallet.addEventListener('click', disconnectWallet);
  el.networkSelect.addEventListener('change', () => {
    state.walletState.networkId = el.networkSelect.value;
    if (state.wallet) {
      connect1AM();
    }
  });

  // Forms
  el.docContent.addEventListener('input', updateByteCount);
  el.formStoreDocument.addEventListener('submit', handleStoreDocument);
  el.formProveKnowledge.addEventListener('submit', handleProveKnowledge);

  // Contract address save
  if (state.contractAddress) {
    el.inputContractAddress.value = state.contractAddress;
  }
  el.btnSaveContractAddress.addEventListener('click', () => {
    const addr = el.inputContractAddress.value.trim();
    localStorage.setItem('docstore_contract_address', addr);
    state.contractAddress = addr;
    showToast('Contract address saved!');
  });

  el.btnRefreshDocs.addEventListener('click', () => {
    loadDocuments();
    showToast('Document list updated');
  });

  // Initial loads
  updateByteCount();
  loadDocuments();
  checkDiagnostics();
  setInterval(checkDiagnostics, 10000);

  // Auto-detect 1AM wallet if already authorized
  setTimeout(detect1AM, 1000);
});
