import { BigNumber } from './bignumber';
import { Constants } from './types';


export const constants: Constants = {
  EXCHANGES: {
    ZERO_EX: 1,
    KYBER: 2,
  },
  MAX_DIGITS_IN_UNSIGNED_256_INT: 78,
  NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
  REBALANCING_STATE: {
    DEFAULT: 0,
    PROPOSAL: 1,
    REBALANCE: 2,
    DRAWDOWN: 3,
  },
  SET_FULL_TOKEN_UNITS: new BigNumber(10 ** 18),
  UNLIMITED_ALLOWANCE_IN_BASE_UNITS: new BigNumber(2).pow(256).minus(1),
  WBTC_FULL_TOKEN_UNITS: new BigNumber(10 ** 8),
  WETH_FULL_TOKEN_UNITS: new BigNumber(10 ** 18),
  ZERO: new BigNumber(0),
  ZERO_EX_SNAPSHOT_EXCHANGE_ADDRESS: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
  ZERO_EX_SNAPSHOT_ERC20_PROXY_ADDRESS: '0x1dc4c1cefef38a777b15aa20260a54e584b16c48',
  ZERO_EX_TOKEN_ADDRESS: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
};
