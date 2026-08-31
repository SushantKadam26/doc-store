import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Document = { documentId: Uint8Array;
                         owner: Uint8Array;
                         title: string;
                         category: string;
                         createdAt: bigint;
                         updatedAt: bigint
                       };

export type PayloadEnvelope = { encryptedRef: Uint8Array;
                                payloadKeyId: Uint8Array;
                                cipher: string;
                                version: bigint
                              };

export type Witnesses<PS> = {
  documentContent(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  ownerPrivateKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  storeDocument(context: __compactRuntime.CircuitContext<PS>,
                title_0: string,
                category_0: string,
                timestamp_0: bigint,
                encryptedRef_0: Uint8Array,
                payloadKeyId_0: Uint8Array,
                cipher_0: string): __compactRuntime.CircuitResults<PS, Uint8Array>;
  storeDocumentWithContent(context: __compactRuntime.CircuitContext<PS>,
                           title_0: string,
                           category_0: string,
                           timestamp_0: bigint,
                           encryptedRef_0: Uint8Array,
                           payloadKeyId_0: Uint8Array,
                           cipher_0: string,
                           content_0: Uint8Array,
                           secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  proveKnowledge(context: __compactRuntime.CircuitContext<PS>,
                 documentId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  checkGrant(context: __compactRuntime.CircuitContext<PS>,
             documentId_0: Uint8Array,
             grantee_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  refuseCorruption(context: __compactRuntime.CircuitContext<PS>,
                   documentId_0: Uint8Array,
                   claimedOwner_0: Uint8Array,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  computeGrant(context: __compactRuntime.CircuitContext<PS>,
               documentId_0: Uint8Array,
               grantee_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type ProvableCircuits<PS> = {
  storeDocument(context: __compactRuntime.CircuitContext<PS>,
                title_0: string,
                category_0: string,
                timestamp_0: bigint,
                encryptedRef_0: Uint8Array,
                payloadKeyId_0: Uint8Array,
                cipher_0: string): __compactRuntime.CircuitResults<PS, Uint8Array>;
  storeDocumentWithContent(context: __compactRuntime.CircuitContext<PS>,
                           title_0: string,
                           category_0: string,
                           timestamp_0: bigint,
                           encryptedRef_0: Uint8Array,
                           payloadKeyId_0: Uint8Array,
                           cipher_0: string,
                           content_0: Uint8Array,
                           secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  proveKnowledge(context: __compactRuntime.CircuitContext<PS>,
                 documentId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  checkGrant(context: __compactRuntime.CircuitContext<PS>,
             documentId_0: Uint8Array,
             grantee_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  refuseCorruption(context: __compactRuntime.CircuitContext<PS>,
                   documentId_0: Uint8Array,
                   claimedOwner_0: Uint8Array,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  computeGrant(context: __compactRuntime.CircuitContext<PS>,
               documentId_0: Uint8Array,
               grantee_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
  publicKey(secret_0: Uint8Array): Uint8Array;
  grantKey(documentId_0: Uint8Array, grantee_0: Uint8Array): Uint8Array;
  computeHash(content_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  storeDocument(context: __compactRuntime.CircuitContext<PS>,
                title_0: string,
                category_0: string,
                timestamp_0: bigint,
                encryptedRef_0: Uint8Array,
                payloadKeyId_0: Uint8Array,
                cipher_0: string): __compactRuntime.CircuitResults<PS, Uint8Array>;
  storeDocumentWithContent(context: __compactRuntime.CircuitContext<PS>,
                           title_0: string,
                           category_0: string,
                           timestamp_0: bigint,
                           encryptedRef_0: Uint8Array,
                           payloadKeyId_0: Uint8Array,
                           cipher_0: string,
                           content_0: Uint8Array,
                           secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  proveKnowledge(context: __compactRuntime.CircuitContext<PS>,
                 documentId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  publicKey(context: __compactRuntime.CircuitContext<PS>, secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  grantKey(context: __compactRuntime.CircuitContext<PS>,
           documentId_0: Uint8Array,
           grantee_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  checkGrant(context: __compactRuntime.CircuitContext<PS>,
             documentId_0: Uint8Array,
             grantee_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  refuseCorruption(context: __compactRuntime.CircuitContext<PS>,
                   documentId_0: Uint8Array,
                   claimedOwner_0: Uint8Array,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  computeHash(context: __compactRuntime.CircuitContext<PS>,
              content_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  computeGrant(context: __compactRuntime.CircuitContext<PS>,
               documentId_0: Uint8Array,
               grantee_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  documents: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Document;
    [Symbol.iterator](): Iterator<[Uint8Array, Document]>
  };
  payload: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): PayloadEnvelope;
    [Symbol.iterator](): Iterator<[Uint8Array, PayloadEnvelope]>
  };
  grants: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly onChainCounter: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
