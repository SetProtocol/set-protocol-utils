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

import { BigNumber } from './bignumber';
import { paddedBufferForPrimitive, paddedBufferForBigNumber, bufferArrayToHex } from './encoding';
import { Address } from './types';


/**
 * Function for clarifying the additional call data parameters that need to be sent to Core when creating
 * a new rebalancing set token
 *
 * @param  managerAddress      Address of the manager to manage the rebalancing
 * @param  proposalPeriod      Time the participants of the Set can withdraw from a rebalance
 *                               once a new Set has been proposed
 * @param  rebalanceInterval   Time between when the manager can initiate another rebalance
 * @return                     String representing call data to send to Core contracts
 */
export function generateRebalancingSetTokenCallData(
  managerAddress: Address,
  proposalPeriod: BigNumber,
  rebalanceInterval: BigNumber,
): string {
  return bufferArrayToHex([
    paddedBufferForPrimitive(managerAddress),
    paddedBufferForBigNumber(proposalPeriod),
    paddedBufferForBigNumber(rebalanceInterval),
  ]);
}

/**
 * Function for clarifying the additional call data parameters that need to be sent to Core when creating
 * a new rebalancing set token
 *
 * @param  managerAddress           Address of the manager to manage the rebalancing
 * @param  liquidatorAddress        Address of liquidator that handles rebalancing
 * @param  recipientAddress         Address of recipient of fees
 * @param  rebalanceInterval        Time between when the manager can initiate another rebalance
 * @param  lastRebalanceTimestamp   Customized time in seconds of the last rebalance
 * @param  entryFee                 Mint fee in scaled value (10e18 value)
 * @param  rebalanceFee             Rebalance fee in scaled value
 * @return                     String representing call data to send to Core contracts
 */
export function generateRebalancingSetTokenV2CallData(
  managerAddress: Address,
  liquidatorAddress: Address,
  feeRecipient: Address,
  rebalanceFeeCalculator: Address,
  rebalanceInterval: BigNumber,
  failRebalancePeriod: BigNumber,
  lastRebalanceTimestamp: BigNumber,
  entryFee: BigNumber,
  rebalanceFeeCalculatorCalldata: Buffer,
): string {
  return bufferArrayToHex([
    paddedBufferForPrimitive(managerAddress),
    paddedBufferForPrimitive(liquidatorAddress),
    paddedBufferForPrimitive(feeRecipient),
    paddedBufferForPrimitive(rebalanceFeeCalculator),
    paddedBufferForBigNumber(rebalanceInterval),
    paddedBufferForBigNumber(failRebalancePeriod),
    paddedBufferForBigNumber(lastRebalanceTimestamp),
    paddedBufferForBigNumber(entryFee),
    rebalanceFeeCalculatorCalldata,
  ]);
}

/**
 * Function for generating Buffer required for RebalancingSetTokenV2 creation. The main input
 * is the rebalance fee.
 *
 * @param  rebalanceFee             Rebalance fee in scaled value
 * @return                          Buffered data
 */
export function generateFixedFeeCalculatorCalldata(rebalanceFee: BigNumber): Buffer {
  return paddedBufferForBigNumber(rebalanceFee);
}

