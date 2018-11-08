
import * as chai from 'chai';

import { 
  getEIP712DomainSeparatorSchemaHash,
  getEIP712DomainHash,
} from '../src/eip712';

const { expect } = chai;

describe('EIP712', () => {
	describe('#getEIP712DomainSeparatorSchemaHash', () => {
		function subject(): string {
      return getEIP712DomainSeparatorSchemaHash();
    }

    it('should return the correct hash', () => {
    	const EIP712Hash = subject();

    	const expectedHash = '0x4c2212af4ffd7e170315f531795cee6c22f874d8f5fab37dfa8ed65e616773d2';

    	expect(EIP712Hash).to.equal(expectedHash);
    });
	});

	describe('#getEIP712DomainHash', () => {
    function subject(): string {
      return getEIP712DomainHash();
    }

    it('should return the correct hash', () => {
      const EIP712Hash = subject();

      const expectedHash = '0xa8dcc602486c63f3c678c9b3c5d615c4d6ab4b7d51868af6881272b5d8bb31ff';

      expect(EIP712Hash).to.equal(expectedHash);
    });
  });
});
