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

import * as _ from 'lodash';
import * as ethUtil from 'ethereumjs-util';
import * as Web3 from 'web3';
import { BigNumber } from 'bignumber.js';

import { constants } from './constants';
import { bufferObjectWithProperties, paddedBufferForBigNumber, paddedBufferForPrimitive } from './encoding';
import { generateTakerWalletOrdersBuffer } from './takerWallet';
import { generateZeroExOrdersBuffer } from './zeroEx';
import {
  Address,
  Bytes,
  Exchanges,
  IssuanceOrder,
  SignedIssuanceOrder,
  SolidityTypes,
  TakerWalletOrder,
  ZeroExSignedFillOrder
} from './types';
import { isTakerWalletOrder, isZeroExOrder } from './typeGuards';

export function generateTimestamp(minutes: number): BigNumber {
  const timeToExpiration = minutes * 60 * 1000;

  return new BigNumber(Math.floor((Date.now() + timeToExpiration) / 1000));
}

export function generateSalt(): BigNumber {
  const randomNumber = BigNumber.random(constants.MAX_DIGITS_IN_UNSIGNED_256_INT);
  const factor = new BigNumber(10).pow(constants.MAX_DIGITS_IN_UNSIGNED_256_INT - 1);

  return randomNumber.times(factor).round();
}

export function hashOrderHex(order: (IssuanceOrder | SignedIssuanceOrder)): string {
  const orderBody = [
    { value: order.setAddress, type: SolidityTypes.Address },
    { value: order.makerAddress, type: SolidityTypes.Address },
    { value: order.makerToken, type: SolidityTypes.Address },
    { value: order.relayerAddress, type: SolidityTypes.Address },
    { value: order.relayerToken, type: SolidityTypes.Address },
    { value: order.quantity, type: SolidityTypes.Uint256 },
    { value: order.makerTokenAmount, type: SolidityTypes.Uint256 },
    { value: order.expiration, type: SolidityTypes.Uint256 },
    { value: order.makerRelayerFee, type: SolidityTypes.Uint256 },
    { value: order.takerRelayerFee, type: SolidityTypes.Uint256 },
    { value: order.salt, type: SolidityTypes.Uint256 },
    { value: order.requiredComponents, type: SolidityTypes.AddressArray },
    { value: order.requiredComponentAmounts, type: SolidityTypes.UintArray },
  ];

  const types = _.map(orderBody, order => order.type);
  const values = _.map(orderBody, order => order.value);
  const buffer = bufferObjectWithProperties(types, values);

  return ethUtil.bufferToHex(buffer);
}

/* ============ Order Data Serialization ============ */

/**
 * Generates a byte string representing serialized exchange orders across different exchanges.
 *
 * @param  makerTokenAddress   Address of the token used to pay for the order
 * @param  makerTokenAmount    Amount of token used to pay for orders
 * @param  fillAmount          Amount of Set being filled
 * @param  orders              Array of order objects from various exchanges
 * @param  web3                web3 instance instantiated with `new Web3(provider);`
 * @return                     Buffer with all exchange orders formatted and concatenated
 */

export function generateSerializedOrders(
  makerTokenAddress: Address,
  makerTokenAmount: BigNumber,
  orders: (TakerWalletOrder | ZeroExSignedFillOrder)[],
  web3: Web3,
): Bytes {
  const orderBuffer: Buffer[] = [];
  const exchanges: Exchanges = {
    'ZERO_EX': [],
    'KYBER': [],
    'TAKER_WALLET': [],
  };
  // Sort exchange orders by exchange
  _.forEach(orders, (order: TakerWalletOrder | ZeroExSignedFillOrder) => {
    let exchangeOrders: any;
    if (isZeroExOrder(order)) {
      exchangeOrders = exchanges.ZERO_EX;
    } else if (isTakerWalletOrder(order)) {
      exchangeOrders = exchanges.TAKER_WALLET;
    }
    if (exchangeOrders) exchangeOrders.push(order);
  });
  // Loop through all exchange orders and create buffers
  _.forEach(exchanges, (exchangeOrders: any[], key: string) => {
    if (exchangeOrders.length === 0) {
      return;
    }
    if (key === 'ZERO_EX') {
      orderBuffer.push(generateZeroExOrdersBuffer(makerTokenAddress, makerTokenAmount, exchangeOrders));
    } else if (key === 'KYBER') {
    } else if (key === 'TAKER_WALLET') {
      orderBuffer.push(generateTakerWalletOrdersBuffer(makerTokenAddress, exchangeOrders, web3));
    }
  });
  return ethUtil.bufferToHex(Buffer.concat(orderBuffer));
}

/**
 * Generates an exchange order header represented as a buffer array.
 *
 * @param  exchangeName          Name of the exchange, ex. 'ZERO_EX'
 * @param  orderCount            Number of exchange orders
 * @param  makerTokenAddress     Token address that the maker is willing to pay with
 * @param  makerTokenAmount      Amount of tokens the maker is willing to pay
 * @param  totalOrderBodyLength  Length of order data buffer
 * @return                       Array containing all inputs as buffers
 */

export function generateExchangeOrderHeader(
  exchangeName: string,
  orderCount: number,
  makerTokenAddress: Address,
  makerTokenAmount: BigNumber,
  totalOrderBodyLength: number,
): Buffer[] {
  return [
    paddedBufferForPrimitive(exchangeName),
    paddedBufferForPrimitive(orderCount),
    paddedBufferForPrimitive(makerTokenAddress),
    paddedBufferForBigNumber(makerTokenAmount),
    paddedBufferForPrimitive(totalOrderBodyLength),
  ];
}
