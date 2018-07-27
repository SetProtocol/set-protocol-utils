import * as ethUtil from 'ethereumjs-util';
import * as Web3 from 'web3';
import { SignatureType, Order } from '@0xproject/types';
import { BigNumber } from '@0xproject/utils';
import { orderHashUtils } from '@0xproject/order-utils';
import { assetDataUtils, generatePseudoRandomSalt } from '@0xProject/order-utils';

import { constants } from './constants';
import { Address, Bytes } from './types';
import {
  bufferArrayToHex,
  numBytesFromHex,
  numBytesFromBuffer,
  paddedBufferForPrimitive,
  paddedBufferForBigNumber,
} from './encoding';

const web3 = new Web3();


export function encodeZeroExOrder(order: Order): Buffer[] {
  return [
      paddedBufferForPrimitive(order.makerAddress),
      paddedBufferForPrimitive(order.takerAddress),
      paddedBufferForPrimitive(order.feeRecipientAddress),
      paddedBufferForPrimitive(order.senderAddress),
      paddedBufferForBigNumber(order.makerAssetAmount),
      paddedBufferForBigNumber(order.takerAssetAmount),
      paddedBufferForBigNumber(order.makerFee),
      paddedBufferForBigNumber(order.takerFee),
      paddedBufferForBigNumber(order.expirationTimeSeconds),
      paddedBufferForBigNumber(order.salt),
      ethUtil.toBuffer(order.makerAssetData),
      ethUtil.toBuffer(order.takerAssetData),
  ];
}

export function generateZeroExExchangeWrapperOrder(zeroExOrder: Order, signature: Bytes, fillAmount: BigNumber): Bytes {
  const { makerAssetData, takerAssetData } = zeroExOrder;

  const makerAssetDataLength = numBytesFromHex(makerAssetData);
  const takerAssetDataLength = numBytesFromHex(takerAssetData);
  const signatureLength: BigNumber = numBytesFromHex(signature);
  const zeroExOrderBuffer = encodeZeroExOrder(zeroExOrder);
  const zeroExOrderLength = numBytesFromBuffer(zeroExOrderBuffer);

  const orderHeader: Buffer[] = [
    paddedBufferForBigNumber(signatureLength),
    paddedBufferForBigNumber(zeroExOrderLength),
    paddedBufferForBigNumber(makerAssetDataLength),
    paddedBufferForBigNumber(takerAssetDataLength),
  ];

  return bufferArrayToHex(
    orderHeader
      .concat([paddedBufferForBigNumber(fillAmount)])
      .concat([ethUtil.toBuffer(signature)])
      .concat(zeroExOrderBuffer)
  );
}

export function generateZeroExOrder(
    makerAddress: Address,
    makerToken: Address,
    takerToken: Address,
    makerAssetAmount: BigNumber,
    takerAssetAmount: BigNumber,
): Order {
  const tenMinutes = 10 * 60 * 1000;
  const randomExpiration = new BigNumber(Date.now() + tenMinutes);
   const makerAssetData = assetDataUtils.encodeERC20AssetData(makerToken);
  const takerAssetData = assetDataUtils.encodeERC20AssetData(takerToken);
   const order = {
    exchangeAddress: constants.ZERO_EX_SNAPSHOT_EXCHANGE_ADDRESS,
    makerAddress,
    takerAddress: constants.NULL_ADDRESS,
    senderAddress: constants.NULL_ADDRESS,
    feeRecipientAddress: constants.NULL_ADDRESS,
    expirationTimeSeconds: randomExpiration,
    salt: generatePseudoRandomSalt(),
    makerAssetAmount,
    takerAssetAmount,
    makerAssetData,
    takerAssetData,
    makerFee: constants.ZERO,
    takerFee: constants.ZERO,
  } as Order;
   return order;
}

export async function signZeroExOrderAsync(order: Order): Promise<string> {
  const orderHashBuffer = orderHashUtils.getOrderHashBuffer(order);
  const orderHashHex = `0x${orderHashBuffer.toString('hex')}`;
  const maker = order.makerAddress;

  return await signMessageAsync(orderHashHex, maker, SignatureType.EthSign);
}

async function signMessageAsync(hexMsg: Bytes, address: Address, sigType: SignatureType): Promise<string> {
    const sig = web3.eth.sign(address, hexMsg);
    const rpcSig = ethUtil.fromRpcSig(sig);
    const signature = Buffer.concat([
        ethUtil.toBuffer(rpcSig.v),
        rpcSig.r,
        rpcSig.s,
        ethUtil.toBuffer(sigType),
    ]);

    return `0x${signature.toString('hex')}`;
}
