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

import { BigNumber } from './bignumber';
import { constants } from './constants';
import { paddedBufferForPrimitive, paddedBufferForBigNumber } from './encoding';
import { generateExchangeOrderHeader } from './orders';
import { Address, KyberTrade } from './types';

/* ============ Kyber Trades Functions ============ */

/**
 * Takes Kyber trades and generates a buffer representing all trades
 *
 * @param  makerTokenAddress   Address of the token used to pay for the order
 * @param  makerTokenAmount    Amount of maker token to contribute to a particular trade
 * @param  trades              Array of KyberTrade interface
 * @return                     Entire kyber trades data as a buffer
 */

export function generateKyberTradesBuffer(
  makerTokenAddress: Address,
  makerTokenAmount: BigNumber,
  trades: KyberTrade[],
): Buffer {
  // Turn all Kyber trades to buffer
  const kyberTradesBody: Buffer[] = _.map(trades, trade => kyberTradeToBuffer(trade));
  const kyberTradesBuffer: Buffer = Buffer.concat(kyberTradesBody);

  // Generate header for Kyber trades
  const kyberTradesHeader: Buffer[] = generateExchangeOrderHeader(
    constants.EXCHANGES.KYBER,
    trades.length,
    makerTokenAddress,
    makerTokenAmount,
    kyberTradesBuffer.length,
  );

  return Buffer.concat([
    Buffer.concat(kyberTradesHeader),
    kyberTradesBuffer,
  ]);
}

/**
 * Takes a Kyber trade object and turns it into a buffer
 *
 * @param  trade   Object conforming to Kyber trade
 * @return         Kyber trade as a buffer
 */

export function kyberTradeToBuffer(
  trade: KyberTrade
): Buffer {
  const kyberSwapBuffer: Buffer[] = [];
  kyberSwapBuffer.push(paddedBufferForPrimitive(trade.sourceToken));
  kyberSwapBuffer.push(paddedBufferForPrimitive(trade.destinationToken));
  kyberSwapBuffer.push(paddedBufferForBigNumber(trade.sourceTokenQuantity));
  kyberSwapBuffer.push(paddedBufferForBigNumber(trade.minimumConversionRate));
  kyberSwapBuffer.push(paddedBufferForBigNumber(trade.maxDestinationQuantity));
  return Buffer.concat(kyberSwapBuffer);
}