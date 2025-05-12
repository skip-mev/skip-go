import { SkipApiOptions } from "src/utils/fetchClient";
import { assets } from "../api/getAssets";
import { ClientState } from "../state";

export type GetMainnetAndTestnetAssetsProps = {
  chainId?: string;
} & SkipApiOptions;

export const getMainnetAndTestnetAssets = async ({
  chainId,
  ...apiOptions
}: GetMainnetAndTestnetAssetsProps) => {
  const [assetsMainnet, assetsTestnet] = await Promise.all([
    assets({
      chainIds: chainId ? [chainId] : undefined,
      ...apiOptions,
    }),
    assets({
      chainIds: chainId ? [chainId] : undefined,
      onlyTestnets: true,
      ...apiOptions,
    }),
  ]);

  const mainnet = assetsMainnet;
  const testnet = assetsTestnet;

  const merged = {
    ...mainnet,
    ...testnet,
  };

  ClientState.skipAssets = merged;

  return merged;
};
