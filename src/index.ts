import { BigNumber } from 'bignumber.js';
import { Order } from '@0xproject/types';
import * as Web3 from 'web3';

import { Address, Bytes, IssuanceOrder, Log, ECSig, TakerWalletOrder } from './types';
import { constants } from './constants';
import {
  bufferArrayToHex,
  concatBytes,
  numBytesFromBuffer,
  numBytesFromHex,
  paddedBufferForBigNumber,
  paddedBufferForPrimitive,
} from './encoding';
import {
  getLogsFromTxHash
} from './logs';
import {
  generateTimestamp,
  generateSalt,
  generateSerializedOrders,
  hashOrderHex,
} from './orders';
import {
  parseSignatureHexAsRSV,
  signMessage,
} from './signing';
import {
  generateZeroExExchangeWrapperOrder,
  generateZeroExOrder,
  signZeroExOrderAsync,
  zeroExOrderToBuffer,
} from './zeroEx';
import {
  generateTakerWalletOrdersBuffer,
} from './takerWallet';

export {
  Address,
  Bytes,
  UInt,
  Constants,
  ECSig,
  Exchanges,
  IssuanceOrder,
  Log,
  SolidityTypes,
  TakerWalletOrder,
} from './types';

/**
 * The Utils class is an entry-point into the set-protocols-util.js library for reusable utility
 * methods that pertain to encoding, order generation, signing, etc.
 */
export class SetProtocolUtils {
  private web3: Web3;

  /**
   * Enumeration of accepted exchange wrapper ids used as part of Exchange headers
   * { ZERO_EX: 1, KYBER: 2, TAKER_WALLET: 3 }
   */
  public static EXCHANGES = constants.EXCHANGES;

  /**
   * Initialize a Utils class
   * @param web3   Web3 instance to use
   */
  public constructor(web3?: Web3) {
    this.web3 = web3 || new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  /* ============ Static SetProtocolUtils Functions ============ */

  /**
   * Converts an array of Buffers into Hex
   * @param   bufferArray   Array of buffers
   * @return  Hex of array of buffers represented as Bytes (string)
   */
  public static bufferArrayToHex(bufferArray: Buffer[]): Bytes {
    return bufferArrayToHex(bufferArray);
  }

  /**
   * Converts an array of Bytes (each prefixed 0x) into one byte array
   * @param   bytes   Array of byte strings
   * @return  A single byte string representing the array of bytes
   */
  public static concatBytes(bytes: Bytes[]): Bytes {
    return concatBytes(bytes);
  }

  /**
   * Generates expiration timestamp that can be used as part of IssuanceOrder
   * @param   minutes   Number of minutes from now
   * @return  Expiration timestamp represented as BigNumber
   */
  public static generateTimestamp(minutes: number): BigNumber {
    return generateTimestamp(minutes);
  }

  /**
   * Generates a pseudo-random 256-bit salt
   * @return  A pseudo-random 256-bit number that can be used as a salt
   */
  public static generateSalt(): BigNumber {
    return generateSalt();
  }

  /**
   * Generates a byte array with a valid 0x order that can be passed into ZeroExExchangeWrapper
   * @param   order       Object conforming to 0x's Order inteface
   * @param   signature   Elliptic curve signature as hex string
   * @param   fillAmount  Amount of 0x order to fill
   * @return  Hex string representation of valid 0xExchangeWrapper order
   */
  public static generateZeroExExchangeWrapperOrder(order: Order, signature: Bytes, fillAmount: BigNumber): Bytes {
    return generateZeroExExchangeWrapperOrder(order, signature, fillAmount);
  }

  /**
   * Generates a 0x order
   * @param   senderAddress           Address calling 0x Exchange contract
   * @param   makerAddress            Maker asset owner
   * @param   takerAddress            Taker assert owner
   * @param   makerFee                Fee accrused to maker
   * @param   takerFee                Fee accrued to taker
   * @param   makerAssetAmount        Amount of asset to exchange
   * @param   takerAssetAmount        Amount of asset to exchange for
   * @param   makerTokenAddress       Address of asset to exchange
   * @param   takerTokenAddress       Address of asset to exchange for
   * @param   salt                    Pseudo-random number acting as a salt
   * @param   exchangeAddress         0x Exchange contract address
   * @param   feeRecipientAddress     Address to send fee
   * @param   expirationTimeSeconds   Order expiration in unix timestamp
   * @return  Object conforming to 0x's Order inteface
   */
  public static generateZeroExOrder(
    senderAddress: Address,
    makerAddress: Address,
    takerAddress: Address,
    makerFee: BigNumber,
    takerFee: BigNumber,
    makerAssetAmount: BigNumber,
    takerAssetAmount: BigNumber,
    makerTokenAddress: Address,
    takerTokenAddress: Address,
    salt: BigNumber,
    exchangeAddress: Address,
    feeRecipientAddress: Address,
    expirationTimeSeconds: BigNumber
  ): Order {
    return generateZeroExOrder(
      senderAddress,
      makerAddress,
      takerAddress,
      makerFee,
      takerFee,
      makerAssetAmount,
      takerAssetAmount,
      makerTokenAddress,
      takerTokenAddress,
      salt,
      exchangeAddress,
      feeRecipientAddress,
      expirationTimeSeconds,
    );
  }

  /**
   * Converts an IssuanceOrder into hex
   * @param   order   An object adhering to the IssuanceOrder interface
   * @return  Hex of Issuance Order represented as hex string
   */
  public static hashOrderHex(order: IssuanceOrder): string {
    return hashOrderHex(order);
  }

  /**
   * Gets the length of a buffer's contents
   * @param   buffer   A buffer of arbitray length
   * @return  Number of bytes in hex representation of the buffer
   */
  public static numBytesFromBuffer(buffer: Buffer[]): BigNumber {
    return numBytesFromBuffer(buffer);
  }

  /**
   * Gets the length of a hex string
   * @param   hex   Hex string
   * @return  Number of bytes in hex representation of the hex
   */
  public static numBytesFromHex(hex: string): BigNumber {
    return numBytesFromHex(hex);
  }

  /**
   * Generates a buffer for a primitive value padded to 32 bytes. Use for encoding addresses (string),
   * enum, etc. Use paddedBufferForBigNumber for token amounts that need to be expressed in high numbers
   * @param   value   Any primitive value (string, number) to encode
   * @return  Primitive value represented as Buffer
   */
  public static paddedBufferForPrimitive(value: any): Buffer {
    return paddedBufferForPrimitive(value);
  }

  /**
   * Generates a buffer for a BigNumber padded to 32 bytes
   * @param   number   BigNumber to encode
   * @return  BigNumber value represented as Buffer
   */
  public static paddedBufferForBigNumber(number: BigNumber): Buffer {
    return paddedBufferForBigNumber(number);
  }

  /**
   * Parses a signature and returns its elliptic curve signature
   * @param   signature   Hex signature to parse
   * @return  An object containing the Elliptic curve signature parameters
   */
  public static parseSignatureHexAsRSV(signature: string): any {
    return parseSignatureHexAsRSV(signature);
  }

  /**
   * Converts a 0x order into binary representation, often to get byte count
   * @param   order   Object conforming to 0x's Order inteface
   * @return  Array of buffers representing the order
   */
  public static zeroExOrderToBuffer(order: Order): Buffer[] {
    return zeroExOrderToBuffer(order);
  }

  /* ============ Non-Static SetProtocolUtils Functions ============ */

  /**
   * Generates a byte string representing serialized exchange orders across different exchanges.
   * @param  makerTokenAddress   Address of the token used to pay for the order
   * @param  orders              Array of orders from various exchanges
   * @return                     Buffer with all exchange orders formatted and concatenated
   */
  public generateSerializedOrders(makerTokenAddress: Address, makerTokenAmount: BigNumber, orders: object[]): Bytes {
    return generateSerializedOrders(makerTokenAddress, makerTokenAmount, orders, this.web3);
  }

  /**
   * Generates a buffer representing taker wallet orders with appropriate headers.
   * @param  makerTokenAddress   Address of the token used to pay for the order
   * @param  orders              Array of orders from taker wallet
   * @return                     Buffer with all exchange orders formatted and concatenated
   */
  public generateTakerWalletOrdersBuffer(makerTokenAddress: Address, orders: TakerWalletOrder[]): Buffer {
    return generateTakerWalletOrdersBuffer(makerTokenAddress, orders, this.web3);
  }

  /**
   * Signs a message and returns it's elliptic curve signature
   * @param   message   Data to sign
   * @param   address   Address to sign with
   * @return  An object containing the Elliptic curve signature parameters
   */
  public async signMessage(message: string, address: Address): Promise<ECSig> {
    return signMessage(this.web3, message, address);
  }

  /**
   * Adds correct signature '0x' and signs 0x order
   * @param   order   Object conforming to 0x's Order inteface
   * @return  Hex string representation of 0x 0rder signature
   */
  public async signZeroExOrderAsync(order: Order): Promise<string> {
    return signZeroExOrderAsync(order, this.web3);
  }
}


/**
 * The TestUtils class is an entry-point into the set-protocols-util.js library for reusable utility
 * methods that pertain to testing
 */
export class SetProtocolTestUtils {
  private web3: Web3;

  /**
   * Address of 0x exchange address contract on test rpc, loaded from snapshot
   */
  public static ZERO_EX_EXCHANGE_ADDRESS = constants.ZERO_EX_SNAPSHOT_EXCHANGE_ADDRESS;

  /**
   * Address of 0x erc20 proxy contract on test rpc, loaded from snapshot
   */
  public static ZERO_EX_ERC20_PROXY_ADDRESS = constants.ZERO_EX_SNAPSHOT_ERC20_PROXY_ADDRESS;

  /**
   * Initialize a TestUtils class
   * @param web3   Web3 instance to use
   */
  public constructor(web3?: Web3) {
    this.web3 = web3 || new Web3();
  }

  /**
   * Retrieves readable logs from a transaction hash
   * @param   txHash   Transaction hash to retrieve logs from
   * @return  Array of logs presented as Log
   */
  public async getLogsFromTxHash(txHash: string): Promise<Log[]> {
    return getLogsFromTxHash(this.web3, txHash);
  }
}
