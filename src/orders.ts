import * as _ from 'lodash';
import * as ethUtil from 'ethereumjs-util';
import { BigNumber } from 'bignumber.js';

import { constants } from './constants';
import { bufferObjectWithProperties } from './encoding';
import { IssuanceOrder, SolidityTypes } from './types';


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
