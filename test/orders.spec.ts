
import * as chai from 'chai';

import {
  IssuanceOrder,
} from './types';
import { generateEIP712IssuanceOrderHash, generateOrderHash } from '../src/orders';

const { expect } = chai;

describe('Orders', () => {
	describe('#generateEIP712IssuanceOrderHash', () => {
		function subject(): string {
      return generateEIP712IssuanceOrderHash();
    }

    it('should return the correct hash', () => {
    	const EIP712Hash = subject();

    	const expectedHash = '0x4afd830c587fce611387a38350e760b2d2fb1b2b469a292353fe64b76cb4f3c4';

    	expect(EIP712Hash).to.equal(expectedHash);
    });
	});

	describe('#generateOrderHash', () => {
		let subjectIssuanceOrder: IssuanceOrder;

		function subject(): string {
      return generateOrderHash();
    }

    describe('', () => {
    	beforeEach(() => {

    	});

    	it('should generate the correct issuance order hash', () => {
    		const issuanceOrderHash = subject();

    		const expectedHash = '';

    	});
    });

	});
});