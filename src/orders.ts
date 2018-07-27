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

import { BigNumber } from 'bignumber.js';
import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import * as Web3 from 'web3';

import { constants } from './constants';
import { bufferObjectWithProperties } from './encoding';
import { generateTakerWalletOrdersBuffer } from './takerWallet';
import { Address, Bytes32, Exchanges, IssuanceOrder, SolidityTypes, TakerWalletOrder } from './types';

export function generateTimestamp(minutes: number): BigNumber {
  const timeToExpiration = minutes * 60 * 1000;

  return new BigNumber(Math.floor((Date.now() + timeToExpiration) / 1000));
}

export function generateSalt(): BigNumber {
  const randomNumber = BigNumber.random(constants.MAX_DIGITS_IN_UNSIGNED_256_INT);
  const factor = new BigNumber(10).pow(constants.MAX_DIGITS_IN_UNSIGNED_256_INT - 1);

  return randomNumber.times(factor).round();
}

export function hashOrderHex(order: IssuanceOrder): string {
  const orderBody = [
    { value: order.setAddress, type: SolidityTypes.Address },
    { value: order.makerAddress, type: SolidityTypes.Address },
    { value: order.makerToken, type: SolidityTypes.Address },
    { value: order.relayerAddress, type: SolidityTypes.Address },
    { value: order.relayerToken, type: SolidityTypes.Address },
    { value: order.quantity, type: SolidityTypes.Uint256 },
    { value: order.makerTokenAmount, type: SolidityTypes.Uint256 },
    { value: order.expiration, type: SolidityTypes.Uint256 },
    { value: order.relayerTokenAmount, type: SolidityTypes.Uint256 },
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
 * @param  makerTokenAddress Address of the token used to pay for the order
 * @param  orders            Array of orders from various exchanges
 * @param  web3              web3 instance instantiated with `new Web3(provider);`
 * @return                   Buffer with all exchange orders formatted and concatenated
 */

export function generateSerializedOrders(
  makerTokenAddress: Address,
  orders: object[],
  web3: Web3,
): Bytes32 {
  const orderBuffer: Buffer[] = [];
  // Sort exchange orders by exchange
  const exchanges: Exchanges = {
    'ZERO_EX': [],
    'KYBER': [],
    'TAKER_WALLET': [],
  };
  _.forEach(orders, (order: TakerWalletOrder) => {
    const { exchange } = order;
    const exchangeOrders: TakerWalletOrder[] = exchanges[exchange];
    exchangeOrders.push(order);
  });
  // Loop through all exchange orders and create buffers
  _.forEach(exchanges, (exchangeOrders, key) => {
    if (key === 'ZERO_EX') {
    } else if (key === 'KYBER') {
    } else if (key === 'TAKER_WALLET') {
      orderBuffer.push(generateTakerWalletOrdersBuffer(makerTokenAddress, exchangeOrders, web3));
    }
  });
  return ethUtil.bufferToHex(Buffer.concat(orderBuffer));
}
