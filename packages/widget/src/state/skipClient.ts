import { atom } from "jotai";
import { SkipClient } from "@skip-go/client";
import {
  Asset,
  assets,
  bridges,
  Chain,
  chains,
  setClientOptions,
  SkipClientOptions,
  venues,
} from "@skip-go/client/v2";

import { atomWithQuery } from "jotai-tanstack-query";
import { endpointOptions, prodApiUrl } from "@/constants/skipClientDefault";
import { walletsAtom } from "./wallets";
import { getConnectedSignersAtom } from "@/state/wallets";
import { getWallet, WalletType } from "graz";
import { getWalletClient } from "@wagmi/core";
import { config } from "@/constants/wagmi";
import { WalletClient } from "viem";
import { defaultTheme, Theme } from "@/widget/theme";
import { solanaWallets } from "@/constants/solana";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => unknown ? A : never;

export const defaultSkipClientConfig = {
  apiUrl: prodApiUrl,
  endpointOptions,
};

export const skipClientConfigAtom = atom<SkipClientOptions>({
  apiUrl: undefined,
  endpointOptions: undefined,
});

export const rootIdAtom = atom<string | undefined>(undefined);

export const themeAtom = atom<Theme>(defaultTheme);

export const setClientOptionsAtom = atom(null, (get, _set, options: SkipClientOptions) => {
  const wallets = get(walletsAtom);
  const getSigners = get(getConnectedSignersAtom);

  setClientOptions({
    ...options,
    getCosmosSigner: async (chainId) => {
      if (getSigners?.getCosmosSigner) {
        return getSigners.getCosmosSigner(chainId);
      }
      if (!wallets.cosmos) {
        throw new Error("getCosmosSigner error: no cosmos wallet");
      }
      const wallet = getWallet(wallets.cosmos.walletName as WalletType);
      if (!wallet) {
        throw new Error("getCosmosSigner error: wallet not found");
      }
      const key = await wallet.getKey(chainId);

      return key.isNanoLedger
        ? wallet.getOfflineSignerOnlyAmino(chainId)
        : wallet.getOfflineSigner(chainId);
    },
    getEVMSigner: async (chainId) => {
      if (getSigners?.getEVMSigner) {
        return getSigners.getEVMSigner(chainId);
      }
      const evmWalletClient = (await getWalletClient(config, {
        chainId: parseInt(chainId),
      })) as WalletClient;

      return evmWalletClient;
    },
    getSVMSigner: async () => {
      if (getSigners?.getSVMSigner) {
        return getSigners.getSVMSigner();
      }
      const walletName = wallets.svm?.walletName;
      if (!walletName) throw new Error("getSVMSigner error: no svm wallet");
      const solanaWallet = solanaWallets.find((w) => w.name === walletName);
      if (!solanaWallet) throw new Error("getSVMSigner error: wallet not found");
      return solanaWallet as ArgumentTypes<typeof SkipClient>["getSVMSigner"];
    },
  });
});

export type ClientAsset = Asset & {
  chain_key: string;
  chainName: string;
};

const flattenData = (data: Record<string, Asset[]>, chains?: Chain[]) => {
  const flattenedData: ClientAsset[] = [];

  for (const chainKey in data) {
    data[chainKey].forEach((asset: Asset) => {
      const chain = chains?.find((c) => c.chainId === asset.chainId);
      flattenedData.push({
        ...asset,
        chain_key: chainKey,
        chainName: chain?.prettyName ?? chain?.chainName ?? asset.chainId ?? "--",
      });
    });
  }

  return flattenedData;
};

export const onlyTestnetsAtom = atom<boolean | undefined>(undefined);

export const skipAssetsAtom = atomWithQuery((get) => {
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const chains = get(skipChainsAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipAssets", onlyTestnets, { onlyTestnets, apiURL, apiKey, cacheDurationMs }],
    queryFn: async () => {
      const response = await assets.request({
        includeEvmAssets: true,
        includeCw20Assets: true,
        includeSvmAssets: true,
        onlyTestnets,
      });

      return flattenData(response as Record<string, Asset[]>, chains.data);
    },
    enabled: onlyTestnets !== undefined && apiURL !== undefined,
  };
});

export const skipChainsAtom = atomWithQuery((get) => {
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipChains", { onlyTestnets, apiURL, apiKey, cacheDurationMs }],
    queryFn: async () => {
      const response = await chains.request({
        includeEvm: true,
        includeSvm: true,
        onlyTestnets,
      });
      return response;
    },
    enabled: onlyTestnets !== undefined && apiURL !== undefined,
  };
});

export const skipBridgesAtom = atomWithQuery((get) => {
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  return {
    queryKey: ["skipBridges", { apiURL, apiKey, cacheDurationMs }],
    queryFn: async () => bridges.request(),
  };
});

export const skipSwapVenuesAtom = atomWithQuery((get) => {
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipSwapVenue", { onlyTestnets, apiURL, apiKey, cacheDurationMs }],
    queryFn: async () => venues.request(),
    enabled: onlyTestnets !== undefined && apiURL !== undefined,
  };
});

export type ChainWithAsset = Chain & {
  asset?: ClientAsset;
};

export const getChainsContainingAsset = (
  assetSymbol: string,
  assets: ClientAsset[],
  chains: Chain[],
): ChainWithAsset[] => {
  if (!assets) return [];
  const chainIds = assets
    .filter((asset) => asset.symbol === assetSymbol)
    .map((asset) => asset.chainId);
  const chainsContainingAsset = chains
    .filter((chain) => chainIds?.includes(chain.chainId))
    .map((chain) => {
      return {
        ...chain,
        asset: assets.find(
          (asset) => asset.chainId === chain.chainId && asset.symbol === assetSymbol,
        ),
      };
    });
  return chainsContainingAsset;
};
