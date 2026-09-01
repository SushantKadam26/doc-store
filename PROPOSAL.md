# Product Proposal: Private Allowlist Access

## Idea Selected
**Private Allowlist Access** — prove membership without revealing identity

## Problem Statement
Allow third parties to verify that a wallet address belongs to a predefined allowlist without revealing the wallet's identity or any other information. This is useful for:
- KYC-verified access to services
- whitelisted token sales
- gated content access without exposing user data
- compliance reporting without privacy violation

## Proposed Solution
Using Midnight's ZK circuit capabilities to prove:
1. That a document/public key hash exists in the allowlist map
2. That the prover knows the secret key corresponding to the allowlisted public key
3. Zero-knowledge: the allowlist contents remain private, only membership is proven

## Midnight Circuit Design
- **Input**: Allowlist map (on-chain), prover's documentContent witness, ownerPrivateKey witness
- **Circuit logic**:
  1. Compute public key from ownerPrivateKey via `publicKey()` circuit
  2. Hash the public key to get allowlist entry key
  3. Assert the computed key exists in the allowlist map
  4. Disclose only: "prover is allowlisted", nothing about identity

## Privacy Guarantees
- Allowlist members: known set, but membership is ZK-provable
- Non-members: cannot prove membership
- No reveal of: wallet seed, balance, other documents, transaction history

## Use Cases
- Gated Discord/Twitter communities
- Private token sales with whitelists
- Compliance-verified access without data exposure
- Sybil-resistant event attendance
