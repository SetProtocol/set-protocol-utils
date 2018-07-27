import { BigNumber } from 'bignumber.js';

import { Constants } from './types';

export const constants: Constants = {
    EXCHANGES: {
      ZERO_EX: 1,
      KYBER: 2,
      TAKER_WALLET: 3,
    },
    MAX_DIGITS_IN_UNSIGNED_256_INT: 78,
    NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
    ZERO: new BigNumber(0),
    ZERO_EX_SNAPSHOT_EXCHANGE_ADDRESS: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
  ZERO_EX_SNAPSHOT_ERC20_PROXY_ADDRESS: '0x1dc4c1cefef38a777b15aa20260a54e584b16c48',
};
