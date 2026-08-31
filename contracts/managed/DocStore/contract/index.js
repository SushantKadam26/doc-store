import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_2 = __compactRuntime.CompactTypeBoolean;

const _descriptor_3 = __compactRuntime.CompactTypeOpaqueString;

class _Document_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))));
  }
  fromValue(value_0) {
    return {
      documentId: _descriptor_0.fromValue(value_0),
      owner: _descriptor_0.fromValue(value_0),
      title: _descriptor_3.fromValue(value_0),
      category: _descriptor_3.fromValue(value_0),
      createdAt: _descriptor_1.fromValue(value_0),
      updatedAt: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.documentId).concat(_descriptor_0.toValue(value_0.owner).concat(_descriptor_3.toValue(value_0.title).concat(_descriptor_3.toValue(value_0.category).concat(_descriptor_1.toValue(value_0.createdAt).concat(_descriptor_1.toValue(value_0.updatedAt))))));
  }
}

const _descriptor_4 = new _Document_0();

const _descriptor_5 = new __compactRuntime.CompactTypeBytes(256);

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _PayloadEnvelope_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_6.alignment())));
  }
  fromValue(value_0) {
    return {
      encryptedRef: _descriptor_0.fromValue(value_0),
      payloadKeyId: _descriptor_0.fromValue(value_0),
      cipher: _descriptor_3.fromValue(value_0),
      version: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.encryptedRef).concat(_descriptor_0.toValue(value_0.payloadKeyId).concat(_descriptor_3.toValue(value_0.cipher).concat(_descriptor_6.toValue(value_0.version))));
  }
}

const _descriptor_7 = new _PayloadEnvelope_0();

const _descriptor_8 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_9 = new __compactRuntime.CompactTypeVector(1, _descriptor_5);

class _Either_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_10 = new _Either_0();

const _descriptor_11 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_12 = new _ContractAddress_0();

const _descriptor_13 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.documentContent) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named documentContent');
    }
    if (typeof(witnesses_0.ownerPrivateKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named ownerPrivateKey');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      storeDocument: (...args_1) => {
        if (args_1.length !== 7) {
          throw new __compactRuntime.CompactError(`storeDocument: expected 7 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const title_0 = args_1[1];
        const category_0 = args_1[2];
        const timestamp_0 = args_1[3];
        const encryptedRef_0 = args_1[4];
        const payloadKeyId_0 = args_1[5];
        const cipher_0 = args_1[6];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('storeDocument',
                                     'argument 1 (as invoked from Typescript)',
                                     'DocStore.compact line 60 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('storeDocument',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'DocStore.compact line 60 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        if (!(encryptedRef_0.buffer instanceof ArrayBuffer && encryptedRef_0.BYTES_PER_ELEMENT === 1 && encryptedRef_0.length === 32)) {
          __compactRuntime.typeError('storeDocument',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'DocStore.compact line 60 char 1',
                                     'Bytes<32>',
                                     encryptedRef_0)
        }
        if (!(payloadKeyId_0.buffer instanceof ArrayBuffer && payloadKeyId_0.BYTES_PER_ELEMENT === 1 && payloadKeyId_0.length === 32)) {
          __compactRuntime.typeError('storeDocument',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'DocStore.compact line 60 char 1',
                                     'Bytes<32>',
                                     payloadKeyId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(title_0).concat(_descriptor_3.toValue(category_0).concat(_descriptor_1.toValue(timestamp_0).concat(_descriptor_0.toValue(encryptedRef_0).concat(_descriptor_0.toValue(payloadKeyId_0).concat(_descriptor_3.toValue(cipher_0)))))),
            alignment: _descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment())))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._storeDocument_0(context,
                                               partialProofData,
                                               title_0,
                                               category_0,
                                               timestamp_0,
                                               encryptedRef_0,
                                               payloadKeyId_0,
                                               cipher_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      storeDocumentWithContent: (...args_1) => {
        if (args_1.length !== 9) {
          throw new __compactRuntime.CompactError(`storeDocumentWithContent: expected 9 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const title_0 = args_1[1];
        const category_0 = args_1[2];
        const timestamp_0 = args_1[3];
        const encryptedRef_0 = args_1[4];
        const payloadKeyId_0 = args_1[5];
        const cipher_0 = args_1[6];
        const content_0 = args_1[7];
        const secret_0 = args_1[8];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('storeDocumentWithContent',
                                     'argument 1 (as invoked from Typescript)',
                                     'DocStore.compact line 81 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('storeDocumentWithContent',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'DocStore.compact line 81 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        if (!(encryptedRef_0.buffer instanceof ArrayBuffer && encryptedRef_0.BYTES_PER_ELEMENT === 1 && encryptedRef_0.length === 32)) {
          __compactRuntime.typeError('storeDocumentWithContent',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'DocStore.compact line 81 char 1',
                                     'Bytes<32>',
                                     encryptedRef_0)
        }
        if (!(payloadKeyId_0.buffer instanceof ArrayBuffer && payloadKeyId_0.BYTES_PER_ELEMENT === 1 && payloadKeyId_0.length === 32)) {
          __compactRuntime.typeError('storeDocumentWithContent',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'DocStore.compact line 81 char 1',
                                     'Bytes<32>',
                                     payloadKeyId_0)
        }
        if (!(content_0.buffer instanceof ArrayBuffer && content_0.BYTES_PER_ELEMENT === 1 && content_0.length === 256)) {
          __compactRuntime.typeError('storeDocumentWithContent',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'DocStore.compact line 81 char 1',
                                     'Bytes<256>',
                                     content_0)
        }
        if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
          __compactRuntime.typeError('storeDocumentWithContent',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'DocStore.compact line 81 char 1',
                                     'Bytes<32>',
                                     secret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(title_0).concat(_descriptor_3.toValue(category_0).concat(_descriptor_1.toValue(timestamp_0).concat(_descriptor_0.toValue(encryptedRef_0).concat(_descriptor_0.toValue(payloadKeyId_0).concat(_descriptor_3.toValue(cipher_0).concat(_descriptor_5.toValue(content_0).concat(_descriptor_0.toValue(secret_0)))))))),
            alignment: _descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_5.alignment().concat(_descriptor_0.alignment())))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._storeDocumentWithContent_0(context,
                                                          partialProofData,
                                                          title_0,
                                                          category_0,
                                                          timestamp_0,
                                                          encryptedRef_0,
                                                          payloadKeyId_0,
                                                          cipher_0,
                                                          content_0,
                                                          secret_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      proveKnowledge: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`proveKnowledge: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const documentId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('proveKnowledge',
                                     'argument 1 (as invoked from Typescript)',
                                     'DocStore.compact line 116 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(documentId_0.buffer instanceof ArrayBuffer && documentId_0.BYTES_PER_ELEMENT === 1 && documentId_0.length === 32)) {
          __compactRuntime.typeError('proveKnowledge',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'DocStore.compact line 116 char 1',
                                     'Bytes<32>',
                                     documentId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._proveKnowledge_0(context,
                                                partialProofData,
                                                documentId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      publicKey(context, ...args_1) {
        return { result: pureCircuits.publicKey(...args_1), context };
      },
      grantKey(context, ...args_1) {
        return { result: pureCircuits.grantKey(...args_1), context };
      },
      checkGrant: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`checkGrant: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const documentId_0 = args_1[1];
        const grantee_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('checkGrant',
                                     'argument 1 (as invoked from Typescript)',
                                     'DocStore.compact line 145 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(documentId_0.buffer instanceof ArrayBuffer && documentId_0.BYTES_PER_ELEMENT === 1 && documentId_0.length === 32)) {
          __compactRuntime.typeError('checkGrant',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'DocStore.compact line 145 char 1',
                                     'Bytes<32>',
                                     documentId_0)
        }
        if (!(grantee_0.buffer instanceof ArrayBuffer && grantee_0.BYTES_PER_ELEMENT === 1 && grantee_0.length === 32)) {
          __compactRuntime.typeError('checkGrant',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'DocStore.compact line 145 char 1',
                                     'Bytes<32>',
                                     grantee_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentId_0).concat(_descriptor_0.toValue(grantee_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._checkGrant_0(context,
                                            partialProofData,
                                            documentId_0,
                                            grantee_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      refuseCorruption: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`refuseCorruption: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const documentId_0 = args_1[1];
        const claimedOwner_0 = args_1[2];
        const timestamp_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('refuseCorruption',
                                     'argument 1 (as invoked from Typescript)',
                                     'DocStore.compact line 160 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(documentId_0.buffer instanceof ArrayBuffer && documentId_0.BYTES_PER_ELEMENT === 1 && documentId_0.length === 32)) {
          __compactRuntime.typeError('refuseCorruption',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'DocStore.compact line 160 char 1',
                                     'Bytes<32>',
                                     documentId_0)
        }
        if (!(claimedOwner_0.buffer instanceof ArrayBuffer && claimedOwner_0.BYTES_PER_ELEMENT === 1 && claimedOwner_0.length === 32)) {
          __compactRuntime.typeError('refuseCorruption',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'DocStore.compact line 160 char 1',
                                     'Bytes<32>',
                                     claimedOwner_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('refuseCorruption',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'DocStore.compact line 160 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentId_0).concat(_descriptor_0.toValue(claimedOwner_0).concat(_descriptor_1.toValue(timestamp_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._refuseCorruption_0(context,
                                                  partialProofData,
                                                  documentId_0,
                                                  claimedOwner_0,
                                                  timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      computeHash(context, ...args_1) {
        return { result: pureCircuits.computeHash(...args_1), context };
      },
      computeGrant: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`computeGrant: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const documentId_0 = args_1[1];
        const grantee_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('computeGrant',
                                     'argument 1 (as invoked from Typescript)',
                                     'DocStore.compact line 183 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(documentId_0.buffer instanceof ArrayBuffer && documentId_0.BYTES_PER_ELEMENT === 1 && documentId_0.length === 32)) {
          __compactRuntime.typeError('computeGrant',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'DocStore.compact line 183 char 1',
                                     'Bytes<32>',
                                     documentId_0)
        }
        if (!(grantee_0.buffer instanceof ArrayBuffer && grantee_0.BYTES_PER_ELEMENT === 1 && grantee_0.length === 32)) {
          __compactRuntime.typeError('computeGrant',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'DocStore.compact line 183 char 1',
                                     'Bytes<32>',
                                     grantee_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentId_0).concat(_descriptor_0.toValue(grantee_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._computeGrant_0(context,
                                              partialProofData,
                                              documentId_0,
                                              grantee_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      storeDocument: this.circuits.storeDocument,
      storeDocumentWithContent: this.circuits.storeDocumentWithContent,
      proveKnowledge: this.circuits.proveKnowledge,
      checkGrant: this.circuits.checkGrant,
      refuseCorruption: this.circuits.refuseCorruption,
      computeGrant: this.circuits.computeGrant
    };
    this.provableCircuits = {
      storeDocument: this.circuits.storeDocument,
      storeDocumentWithContent: this.circuits.storeDocumentWithContent,
      proveKnowledge: this.circuits.proveKnowledge,
      checkGrant: this.circuits.checkGrant,
      refuseCorruption: this.circuits.refuseCorruption,
      computeGrant: this.circuits.computeGrant
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('storeDocument', new __compactRuntime.ContractOperation());
    state_0.setOperation('storeDocumentWithContent', new __compactRuntime.ContractOperation());
    state_0.setOperation('proveKnowledge', new __compactRuntime.ContractOperation());
    state_0.setOperation('checkGrant', new __compactRuntime.ContractOperation());
    state_0.setOperation('refuseCorruption', new __compactRuntime.ContractOperation());
    state_0.setOperation('computeGrant', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(0n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(1n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(2n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(3n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_8, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_9, value_0);
    return result_0;
  }
  _documentContent_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.documentContent(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 256)) {
      __compactRuntime.typeError('documentContent',
                                 'return value',
                                 'DocStore.compact line 53 char 1',
                                 'Bytes<256>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  _ownerPrivateKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.ownerPrivateKey(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('ownerPrivateKey',
                                 'return value',
                                 'DocStore.compact line 54 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _storeDocument_0(context,
                   partialProofData,
                   title_0,
                   category_0,
                   timestamp_0,
                   encryptedRef_0,
                   payloadKeyId_0,
                   cipher_0)
  {
    return this._storeDocumentWithContent_0(context,
                                            partialProofData,
                                            title_0,
                                            category_0,
                                            timestamp_0,
                                            encryptedRef_0,
                                            payloadKeyId_0,
                                            cipher_0,
                                            this._documentContent_0(context,
                                                                    partialProofData),
                                            this._ownerPrivateKey_0(context,
                                                                    partialProofData));
  }
  _storeDocumentWithContent_0(context,
                              partialProofData,
                              title_0,
                              category_0,
                              timestamp_0,
                              encryptedRef_0,
                              payloadKeyId_0,
                              cipher_0,
                              content_0,
                              secret_0)
  {
    const documentId_0 = this._persistentHash_1([content_0]);
    const owner_0 = this._publicKey_0(secret_0);
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_13.toValue(0n),
                                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Document already exists');
    const tmp_0 = { documentId: documentId_0,
                    owner: owner_0,
                    title: title_0,
                    category: category_0,
                    createdAt: timestamp_0,
                    updatedAt: timestamp_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(0n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = { encryptedRef: encryptedRef_0,
                    payloadKeyId: payloadKeyId_0,
                    cipher: cipher_0,
                    version: 1n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_1),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(3n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_6.toValue(tmp_2),
                                                                alignment: _descriptor_6.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return documentId_0;
  }
  _proveKnowledge_0(context, partialProofData, documentId_0) {
    const id_0 = documentId_0;
    const computed_0 = this._persistentHash_1([this._documentContent_0(context,
                                                                       partialProofData)]);
    __compactRuntime.assert(this._equal_0(computed_0, id_0),
                            'Content does not match');
    const caller_0 = this._publicKey_0(this._ownerPrivateKey_0(context,
                                                               partialProofData));
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(0n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Document not found');
    __compactRuntime.assert(this._equal_1(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_13.toValue(0n),
                                                                                                                                alignment: _descriptor_13.alignment() } }] } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_0.toValue(id_0),
                                                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value).owner,
                                          caller_0),
                            'Not the document owner');
    id_0;
    caller_0;
    return [];
  }
  _publicKey_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 100, 111, 99, 115, 116, 111, 114, 101, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   secret_0]);
  }
  _grantKey_0(documentId_0, grantee_0) {
    return this._persistentHash_0([documentId_0, grantee_0]);
  }
  _checkGrant_0(context, partialProofData, documentId_0, grantee_0) {
    const id_0 = documentId_0;
    const g_0 = grantee_0;
    const granted_0 = this._computeGrant_0(context, partialProofData, id_0, g_0);
    id_0; g_0; return granted_0;
  }
  _refuseCorruption_0(context,
                      partialProofData,
                      documentId_0,
                      claimedOwner_0,
                      timestamp_0)
  {
    const caller_0 = this._publicKey_0(this._ownerPrivateKey_0(context,
                                                               partialProofData));
    const id_0 = documentId_0;
    const owner_0 = claimedOwner_0;
    __compactRuntime.assert(this._equal_2(caller_0, owner_0),
                            'Not the claimed owner');
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_13.toValue(0n),
                                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Document not found');
    const tmp_0 = this._grantKey_0(id_0, owner_0);
    const tmp_1 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(2n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    id_0;
    owner_0;
    timestamp_0;
    return [];
  }
  _computeHash_0(content_0) { return this._persistentHash_1([content_0]); }
  _computeGrant_0(context, partialProofData, documentId_0, grantee_0) {
    const key_0 = this._grantKey_0(documentId_0, grantee_0);
    const result_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_13.toValue(2n),
                                                                                                           alignment: _descriptor_13.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                       alignment: _descriptor_0.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value)
                     ?
                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_13.toValue(2n),
                                                                                                           alignment: _descriptor_13.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(key_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     :
                     0n;
    return result_0;
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    documents: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'DocStore.compact line 47 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'DocStore.compact line 47 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    payload: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'DocStore.compact line 48 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'DocStore.compact line 48 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_7.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    grants: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'DocStore.compact line 49 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'DocStore.compact line 49 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get onChainCounter() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_13.toValue(3n),
                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  documentContent: (...args) => undefined,
  ownerPrivateKey: (...args) => undefined
});
export const pureCircuits = {
  publicKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`publicKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('publicKey',
                                 'argument 1',
                                 'DocStore.compact line 131 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._publicKey_0(secret_0);
  },
  grantKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`grantKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const documentId_0 = args_0[0];
    const grantee_0 = args_0[1];
    if (!(documentId_0.buffer instanceof ArrayBuffer && documentId_0.BYTES_PER_ELEMENT === 1 && documentId_0.length === 32)) {
      __compactRuntime.typeError('grantKey',
                                 'argument 1',
                                 'DocStore.compact line 139 char 1',
                                 'Bytes<32>',
                                 documentId_0)
    }
    if (!(grantee_0.buffer instanceof ArrayBuffer && grantee_0.BYTES_PER_ELEMENT === 1 && grantee_0.length === 32)) {
      __compactRuntime.typeError('grantKey',
                                 'argument 2',
                                 'DocStore.compact line 139 char 1',
                                 'Bytes<32>',
                                 grantee_0)
    }
    return _dummyContract._grantKey_0(documentId_0, grantee_0);
  },
  computeHash: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`computeHash: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const content_0 = args_0[0];
    if (!(content_0.buffer instanceof ArrayBuffer && content_0.BYTES_PER_ELEMENT === 1 && content_0.length === 256)) {
      __compactRuntime.typeError('computeHash',
                                 'argument 1',
                                 'DocStore.compact line 179 char 1',
                                 'Bytes<256>',
                                 content_0)
    }
    return _dummyContract._computeHash_0(content_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
