/*
  Copyright 2018 Set Labs Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

'use strict';

import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import * as Web3 from 'web3';
import { SignatureType, Order } from '@0xproject/types';
import { BigNumber } from '@0xproject/utils';
import { assetDataUtils, orderHashUtils } from '@0xproject/order-utils';

import { constants } from './constants';
import { generateExchangeOrderHeader } from './orders';
import { Address, Bytes } from './types';
import {
  bufferArrayToHex,
  numBytesFromHex,
  numBytesFromBuffer,
  paddedBufferForPrimitive,
  paddedBufferForBigNumber,
} from './encoding';


export function generateZeroExOrdersBuffer(
  makerTokenAddress: Address,
  makerTokenAmount: BigNumber,
  orders: Order[],
) {
  const zeroExOrderHeader: Buffer[] = generateExchangeOrderHeader(
    constants.EXCHANGES.ZERO_EX,
    makerTokenAddress,
    makerTokenAmount,
    orders.length,
  );
  const zeroExOrderBody: Buffer[] = _.map(orders, order => Buffer.concat(zeroExOrderToBuffer(order)));
  return Buffer.concat([
    Buffer.concat(zeroExOrderHeader),
    Buffer.concat(zeroExOrderBody),
  ]);
}

export function zeroExOrderToBuffer(order: Order): Buffer[] {
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
  const zeroExOrderBuffer = zeroExOrderToBuffer(zeroExOrder);
  const zeroExOrderLength = numBytesFromBuffer(zeroExOrderBuffer);

  const orderHeader: Buffer[] = [
    paddedBufferForBigNumber(signatureLength),
    paddedBufferForBigNumber(zeroExOrderLength),
    paddedBufferForBigNumber(makerAssetDataLength),
    paddedBufferForBigNumber(takerAssetDataLength),
    paddedBufferForBigNumber(fillAmount),
  ];

  return bufferArrayToHex(
    orderHeader
      .concat([ethUtil.toBuffer(signature)])
      .concat(zeroExOrderBuffer)
  );
}

export function generateZeroExOrder(
  senderAddress: Address,
  makerAddress: Address,
  takerAddress: Address,
  makerFee: BigNumber,
  takerFee: BigNumber,
  makerAssetAmount: BigNumber,
  takerAssetAmount: BigNumber,
  makerTokenAddress: Address,
  takerTokenAddress: Address,
  salt: BigNumber,
  exchangeAddress: Address,
  feeRecipientAddress: Address,
  expirationTimeSeconds: BigNumber
): Order {
  return {
    senderAddress,
    makerAddress,
    takerAddress,
    makerFee,
    takerFee,
    makerAssetAmount,
    takerAssetAmount,
    makerAssetData: assetDataUtils.encodeERC20AssetData(makerTokenAddress),
    takerAssetData: assetDataUtils.encodeERC20AssetData(takerTokenAddress),
    salt,
    exchangeAddress,
    feeRecipientAddress,
    expirationTimeSeconds,
  } as Order;
}

export async function signZeroExOrderAsync(order: Order, web3: Web3): Promise<string> {
  const orderHashBuffer = orderHashUtils.getOrderHashBuffer(order);
  const orderHashHex = `0x${orderHashBuffer.toString('hex')}`;
  const maker = order.makerAddress;

  return await signMessageAsync(orderHashHex, maker, SignatureType.EthSign, web3);
}

async function signMessageAsync(hexMsg: Bytes, address: Address, sigType: SignatureType, web3: Web3): Promise<string> {
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