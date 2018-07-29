import { Order } from '@0xproject/types';

import { TakerWalletOrder } from './types';

export function isZeroExOrder(object: any): object is Order {
  return (
    'exchangeAddress' in object &&
    'makerAddress' in object &&
    'takerAddress' in object &&
    'senderAddress' in object &&
    'feeRecipientAddress' in object &&
    'expirationTimeSeconds' in object &&
    'salt' in object &&
    'makerAssetAmount' in object &&
    'takerAssetAmount' in object &&
    'makerAssetData' in object &&
    'takerAssetData' in object &&
    'makerFee' in object &&
    'takerFee' in object
  );
}

export function isTakerWalletOrder(object: any): object is TakerWalletOrder {
  return (
    'takerTokenAddress' in object &&
    'takerTokenAmount' in object
  );
}