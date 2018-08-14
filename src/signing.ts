import * as ethUtil from 'ethereumjs-util';
import Web3 = require('web3');

import { Address, ECSig } from './types';


export function parseSignatureHexAsRSV(signatureHex: string): ECSig {
  const { v, r, s } = ethUtil.fromRpcSig(signatureHex);

  return {
    v,
    r: ethUtil.bufferToHex(r),
    s: ethUtil.bufferToHex(s),
  };
}

export async function signMessage(web3: Web3, message: string, address: Address): Promise<ECSig> {
  const signature = web3.eth.sign(address, message);

  return parseSignatureHexAsRSV(signature);
}
