import { assets } from "../api/getAssets";
import { ClientState } from "../state";

export const getMainnetAndTestnetAssets = async (chainId?: string) => {
  const [assetsMainnet, assetsTestnet] = await Promise.all([
    assets({
      chainIds: chainId ? [chainId] : undefined,
    }),
    assets({
      chainIds: chainId ? [chainId] : undefined,
      onlyTestnets: true,
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
