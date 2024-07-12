import { Buffer as BufferPolyfill } from 'buffer';
globalThis.Buffer = BufferPolyfill;

import { WalletClient } from '@cosmos-kit/core';
import { wallets as cosmostation } from '@cosmos-kit/cosmostation-extension';
import { wallets as keplr } from '@cosmos-kit/keplr-extension';
import { wallets as leap } from '@cosmos-kit/leap-extension';
import { wallets as okxwallet } from '@cosmos-kit/okxwallet';
import { wallets as station } from '@cosmos-kit/station';
import { wallets as vectis } from '@cosmos-kit/vectis';

export const wallets = [
  ...keplr,
  ...cosmostation,
  ...leap,
  ...okxwallet,
  ...station,
  ...vectis,
];

export type MergedWalletClient =
  | import('@cosmos-kit/cosmostation-extension/cjs/extension/client').CosmostationClient
  | import('@cosmos-kit/keplr-extension/cjs/extension/client').KeplrClient
  | import('@cosmos-kit/leap-extension/cjs/extension/client').LeapClient
  | import('@cosmos-kit/okxwallet-extension/cjs/extension/client').OkxwalletClient
  | import('@cosmos-kit/station-extension/cjs/extension/client').StationClient
  | import('@cosmos-kit/vectis-extension/cjs/extension/client').VectisClient
  | WalletClient;
