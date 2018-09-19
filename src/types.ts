import { BigNumber } from './bignumber';

export type Address = string;
export type Bytes = string;
export type UInt = number | BigNumber;
export type ExchangeOrder = ZeroExSignedFillOrder | TakerWalletOrder;

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

export interface SignedIssuanceOrder extends IssuanceOrder {
  signature: ECSig;
}

export interface ZeroExSignedFillOrder {
  senderAddress: string;
  makerAddress: string;
  takerAddress: string;
  makerFee: BigNumber;
  takerFee: BigNumber;
  makerAssetAmount: BigNumber;
  takerAssetAmount: BigNumber;
  makerAssetData: string;
  takerAssetData: string;
  salt: BigNumber;
  exchangeAddress: string;
  feeRecipientAddress: string;
  expirationTimeSeconds: BigNumber;
  signature: string;
  fillAmount: BigNumber;
}

export interface TakerWalletOrder {
  takerTokenAddress: Address;
  takerTokenAmount: BigNumber;
}
