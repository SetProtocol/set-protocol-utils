import { BigNumber } from 'bignumber.js';
import { SignedOrder } from '@0xproject/types';

export type Address = string;
export type Bytes = string;
export type UInt = number | BigNumber;

export interface Constants {
  [constantId: string]: any;
}

export interface Log {
  event: string;
  address: Address;
  args: any;
}

export enum SolidityTypes {
  Address = 'address',
  Uint256 = 'uint256',
  Uint8 = 'uint8',
  Uint = 'uint',
  AddressArray = 'address[]',
  UintArray = 'uint256[]',
}

/* ============ Issuance Orders ============ */

export interface ECSig {
  v: UInt;
  r: string;
  s: string;
}

export interface Exchanges {
  [exchangeId: string]: TakerWalletOrder[];
}

export interface IssuanceOrder {
  setAddress: Address;
  makerAddress: Address;
  makerToken: Address;
  relayerAddress: Address;
  relayerToken: Address;
  quantity: BigNumber;
  makerTokenAmount: BigNumber;
  expiration: BigNumber;
  makerRelayerFee: BigNumber;
  takerRelayerFee: BigNumber;
  salt: BigNumber;
  requiredComponents: Address[];
  requiredComponentAmounts: BigNumber[];
}

export interface SignedIssuanceOrder {
  setAddress: Address;
  makerAddress: Address;
  makerToken: Address;
  relayerAddress: Address;
  relayerToken: Address;
  quantity: BigNumber;
  makerTokenAmount: BigNumber;
  expiration: BigNumber;
  makerRelayerFee: BigNumber;
  takerRelayerFee: BigNumber;
  salt: BigNumber;
  requiredComponents: Address[];
  requiredComponentAmounts: BigNumber[];
  signature: ECSig;
}

export interface ZeroExSignedFillOrder extends SignedOrder {
    fillAmount: BigNumber;
}

export interface TakerWalletOrder {
  takerTokenAddress: Address;
  takerTokenAmount: BigNumber;
}
