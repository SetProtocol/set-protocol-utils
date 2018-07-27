import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';

import { Address, Bytes32, IssuanceOrder, Log, ECSig } from './types';
import { constants } from './constants';
import {
  bufferArrayToHex,
  paddedBufferForBigNumber,
  paddedBufferForPrimitive,
} from './encoding';
import {
  getLogsFromTxHash
} from './logs';
import {
  generateTimestamp,
  generateSalt,
  hashOrderHex
} from './orders';
import {
  parseSignatureHexAsRSV,
  signMessage
} from './signing';


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
    this.web3 = web3 || new Web3();
  }

  /**
   * Converts an array of Buffers into Hex
   * @param   bufferArray   Array of buffers
   * @return  Hex of array of buffers represented as Bytes32 (string)
   */
  public static bufferArrayToHex(bufferArray: Buffer[]): Bytes32 {
    return bufferArrayToHex(bufferArray);
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
   * Converts an IssuanceOrder into hex
   * @param   order   An object adhering to the IssuanceOrder interface
   * @return  Hex of Issuance Order represented as hex string
   */
  public static hashOrderHex(order: IssuanceOrder): string {
    return hashOrderHex(order);
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
   * Signs a message and returns it's elliptic curve signature
   * @param   message   Data to sign
   * @param   address   Address to sign with
   * @return  An object containing the Elliptic curve signature parameters
   */
  public async signMessage(message: string, address: Address): Promise<ECSig> {
    return signMessage(this.web3, message, address);
  }
}


/**
 * The TestUtils class is an entry-point into the set-protocols-util.js library for reusable utility
 * methods that pertain to testing
 */
export class SetProtocolTestUtils {
  private web3: Web3;

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
