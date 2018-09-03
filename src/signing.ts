import * as ethUtil from 'ethereumjs-util';
import * as Web3 from 'web3';

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
  const signature = await web3.eth.sign(address, message);

  return parseSignatureHexAsRSV(signature);
}
