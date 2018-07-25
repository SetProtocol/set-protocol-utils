import { BigNumber } from 'bignumber.js';


export type Address = string;
export type Bytes32 = string;
export type Bytes = string;
export type UInt = number | BigNumber;

export interface IssuanceOrder {
    setAddress: Address;
    makerAddress: Address;
    makerToken: Address;
    relayerAddress: Address;
    relayerToken: Address;
    quantity: BigNumber;
    makerTokenAmount: BigNumber;
    expiration: BigNumber;
    relayerTokenAmount: BigNumber;
    salt: BigNumber;
    requiredComponents: Address[];
    requiredComponentAmounts: BigNumber[];
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
