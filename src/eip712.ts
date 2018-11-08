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
import * as ethUtil from 'ethereumjs-util';
import { hashObject, hashString } from './encoding';
import {
  Bytes,
  SolidityTypes,
} from './types';

// EIP191 header for EIP712 prefix
const EIP191_HEADER = '\x19\x01';

// EIP712 Domain Name value
const EIP712_DOMAIN_NAME = 'Set Protocol';

// EIP712 Domain Version value
const EIP712_DOMAIN_VERSION = '1';

export function getEIP712DomainSeparatorSchemaHash(): string {
  // // Hash of the EIP712 Domain Separator Schema
  // bytes32 constant internal EIP712_DOMAIN_SEPARATOR_SCHEMA_HASH = keccak256(
  //     abi.encodePacked(
  //         "EIP712Domain(",
  //         "string name,",
  //         "string version,",
  //         ")"
  //     )
  // );
  const domainSeparatorBody = [
    { value: 'EIP712Domain(', type: SolidityTypes.String },
    { value: 'string name,', type: SolidityTypes.String },
    { value: 'string version,', type: SolidityTypes.String },
    { value: ')', type: SolidityTypes.String },
  ];

  const types = _.map(domainSeparatorBody, order => order.type);
  const values = _.map(domainSeparatorBody, order => order.value);
  const domainHash: Buffer = hashObject(types, values);

  return ethUtil.bufferToHex(domainHash);
}

export function getEIP712DomainHash(): string {
  // bytes32 constant internal EIP712_DOMAIN_HASH = keccak256(abi.encodePacked(
  //     EIP712_DOMAIN_SEPARATOR_SCHEMA_HASH,
  //     keccak256(bytes(EIP712_DOMAIN_NAME)),
  //     keccak256(bytes(EIP712_DOMAIN_VERSION))
  // ));

  const domainSeparatorBody = [
    { value: getEIP712DomainSeparatorSchemaHash(), type: SolidityTypes.Bytes32 },
    { value: ethUtil.bufferToHex(hashString(EIP712_DOMAIN_NAME)), type: SolidityTypes.Bytes32 },
    { value: ethUtil.bufferToHex(hashString(EIP712_DOMAIN_VERSION)), type: SolidityTypes.Bytes32 },
  ];

  const types = _.map(domainSeparatorBody, order => order.type);
  const values = _.map(domainSeparatorBody, order => order.value);
  const domainHash: Buffer = hashObject(types, values);

  return ethUtil.bufferToHex(domainHash);
}

export function generateEIP712MessageHash(hashStruct: Bytes): string {
  // keccak256(abi.encodePacked(
  //     EIP191_HEADER,
  //     EIP712_DOMAIN_HASH,
  //     hashStruct
  // ));

  const messageBody = [
    { value: EIP191_HEADER, type: SolidityTypes.String },
    { value: getEIP712DomainSeparatorSchemaHash(), type: SolidityTypes.Bytes32 },
    { value: hashStruct, type: SolidityTypes.Bytes32 },
  ];

  const types = _.map(messageBody, order => order.type);
  const values = _.map(messageBody, order => order.value);
  const messageHash: Buffer = hashObject(types, values);

  return ethUtil.bufferToHex(messageHash);
}




