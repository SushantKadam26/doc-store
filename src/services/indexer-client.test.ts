/**
 * Unit tests for indexer client service
 */
import { describe, it, expect } from 'vitest';
import { resolveNetwork, generateMnemonicPhrase, isValidMnemonic } from './network.ts';

describe('Mnemonic utilities', () => {
  it('should normalize mnemonic', () => {
    const result = isValidMnemonic('word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12');
    expect(result).toBe(true);
  });

  it('should generate mnemonic phrase', () => {
    const phrase = generateMnemonicPhrase();
    expect(phrase.split(' ').length).toBe(24);
  });
});
