
import * as chai from 'chai';

import {
  Bytes,
} from '../src/types';

import { 
  getEIP712DomainSeparatorSchemaHash,
  getEIP712DomainHash,
  generateEIP712MessageHash,
} from '../src/eip712';

const { expect } = chai;

describe('EIP712', () => {
	describe('#getEIP712DomainSeparatorSchemaHash', () => {
		function subject(): string {
      return getEIP712DomainSeparatorSchemaHash();
    }

    it('should return the correct hash', () => {
    	const returnedHash = subject();

    	const expectedHash = '0x4c2212af4ffd7e170315f531795cee6c22f874d8f5fab37dfa8ed65e616773d2';

    	expect(returnedHash).to.equal(expectedHash);
    });
	});

	describe('#getEIP712DomainHash', () => {
    function subject(): string {
      return getEIP712DomainHash();
    }

    it('should return the correct hash', () => {
      const returnedHash = subject();

      const expectedHash = '0xa8dcc602486c63f3c678c9b3c5d615c4d6ab4b7d51868af6881272b5d8bb31ff';

      expect(returnedHash).to.equal(expectedHash);
    });
  });

  describe('#generateEIP712MessageHash', () => {
    let subjectHashStruct: Bytes = '0x0000000000000000000000000000000000000000000000000000000000000000';

    function subject(): string {
      return generateEIP712MessageHash(subjectHashStruct);
    }

    it('should return the correct hash', () => {
      const returnedHash = subject();

      const expectedHash = '0x5686079a65f95107943e531f6f7f755044148600233246c75fdce6e59c85cae5';

      expect(returnedHash).to.equal(expectedHash);
    });
  });
});
