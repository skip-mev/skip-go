import { WalletClient } from '@cosmos-kit/core';

const { wallets: keplr } = await import('@cosmos-kit/keplr-extension');
const { wallets: leap } = await import('@cosmos-kit/leap-extension');
const { wallets: cosmostation } = await import(
  '@cosmos-kit/cosmostation-extension'
);
const { wallets: okxwallet } = await import('@cosmos-kit/okxwallet');
const { wallets: station } = await import('@cosmos-kit/station');
const { wallets: vectis } = await import('@cosmos-kit/vectis');

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
