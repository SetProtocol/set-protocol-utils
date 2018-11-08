
import * as chai from 'chai';
import { BigNumber } from '../src/bignumber';

import {
  IssuanceOrder,
} from '../src/types';
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
      return generateOrderHash(subjectIssuanceOrder);
    }

  	it('should generate the correct issuance order hash', () => {
  		subjectIssuanceOrder = {
  			setAddress: "0xA8dDa8d7F5310E4A9E24F8eBA77E091Ac264f872",
  			makerAddress: "0xE834EC434DABA538cd1b9Fe1582052B880BD7e63",
  			makerToken: "0x06cEf8E666768cC40Cc78CF93d9611019dDcB628",
  			relayerAddress: "0x78dc5D2D739606d31509C31d654056A45185ECb6",
  			relayerToken: "0x4404ac8bd8F9618D27Ad2f1485AA1B2cFD82482D",
  			quantity: new BigNumber('4000000000000000000'),
  			makerTokenAmount:  new BigNumber("10000000000000000000"),
  			expiration: new BigNumber("1541647310"),
  			makerRelayerFee: new BigNumber("1000000000000000000"),
  			takerRelayerFee: new BigNumber("2000000000000000000"),
  			salt: new BigNumber("67973443484056420122959491841293512889323885373764273392266387061081721811775"),
  			requiredComponents: ["0x06cEf8E666768cC40Cc78CF93d9611019dDcB628","0x4404ac8bd8F9618D27Ad2f1485AA1B2cFD82482D"],
  			requiredComponentAmounts: [new BigNumber("2000000000000000000"), new BigNumber("2000000000000000000")]
  		};

  		const issuanceOrderHash = subject();

  		const expectedHash = '0x3c3749f295b9df7005e51bdb113516a4cf146a2319a5da9612614915d9268043';

  		expect(issuanceOrderHash).to.equal(expectedHash);
  	});
	});
});