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
import Web3 = require('web3');
import { BigNumber } from 'bignumber.js';

import { constants } from './constants';
import { paddedBufferForPrimitive } from './encoding';
import { generateExchangeOrderHeader } from './orders';
import { Address, TakerWalletOrder } from './types';

/* ============ Taker Wallet Order Functions ============ */

/**
 * Takes taker wallet orders and generates a buffer representing all orders the
 * taker can fill directly from their wallet.
 *
 * @param  makerTokenAddress Address of the token used to pay for the order
 * @param  orders            Array of TakerWalletOrders
 * @param  web3              web3 instance instantiated with `new Web3(provider);`
 * @return                   Entire taker wallet orders data as a buffer
 */

export function generateTakerWalletOrdersBuffer(
  makerTokenAddress: Address,
  orders: TakerWalletOrder[],
  web3: Web3,
): Buffer {
  // Turn all taker wallet orders to buffers
  const takerOrderBody: Buffer[] = _.map(orders, ({takerTokenAddress, takerTokenAmount}) =>
    takerWalletOrderToBuffer(takerTokenAddress, takerTokenAmount, web3));
  const takerOrderBodyBuffer: Buffer = Buffer.concat(takerOrderBody);

  // Generate header for taker wallet order
  const takerOrderHeader: Buffer[] = generateExchangeOrderHeader(
    constants.EXCHANGES.TAKER_WALLET,
    orders.length,
    makerTokenAddress,
    new BigNumber(0), // Taker wallet orders do not take any maker token to execute
    takerOrderBodyBuffer.length,
  );

  return Buffer.concat([
    Buffer.concat(takerOrderHeader),
    takerOrderBodyBuffer,
  ]);
}

/**
 * Takes a taker wallet order object and turns it into a buffer.
 *
 * @param  takerTokenAddress Address of the token the taker will fill in the taker wallet order
 * @param  takerTokenAmount  Amount of tokens the taker will fill in the order
 * @param  web3              web3 instance instantiated with `new Web3(provider);`
 * @return                   Taker wallet order as a buffer
 */

export function takerWalletOrderToBuffer(
  takerTokenAddress: Address,
  takerTokenAmount: BigNumber,
  web3: Web3,
): Buffer {
  const takerWalletOrder: Buffer[] = [];
  takerWalletOrder.push(paddedBufferForPrimitive(takerTokenAddress));
  takerWalletOrder.push(paddedBufferForPrimitive(web3.toHex(takerTokenAmount)));
  return Buffer.concat(takerWalletOrder);
}
