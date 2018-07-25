import * as ethUtil from 'ethereumjs-util';
import * as Web3 from 'web3';

import { Address, ECSig } from './types';

const web3 = new Web3();


export function parseSignatureHexAsRSV(signatureHex: string): ECSig {
  const { v, r, s } = ethUtil.fromRpcSig(signatureHex);

  return {
    v,
    r: ethUtil.bufferToHex(r),
    s: ethUtil.bufferToHex(s),
  };
}

export async function signMessage(message: string, address: Address): Promise<ECSig> {
  const signature = web3.eth.sign(address, message);

  return parseSignatureHexAsRSV(signature);
}
