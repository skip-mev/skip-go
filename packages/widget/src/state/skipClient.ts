import { atom } from "jotai";
import { Asset, SkipClient, Chain, SkipClientOptions } from "@skip-go/client";
import { atomWithQuery } from "jotai-tanstack-query";
import { endpointOptions, prodApiUrl } from "@/constants/skipClientDefault";
import { walletsAtom } from "./wallets";
import { getConnectedSignersAtom } from "@/state/wallets";
import { getWallet, WalletType } from "graz";
import { getWalletClient } from "@wagmi/core";
import { config } from "@/constants/wagmi";
import { WalletClient } from "viem";
import { defaultTheme, Theme } from "@/widget/theme";
import { Wallet } from "@solana/wallet-adapter-react";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => unknown ? A : never;

export const defaultSkipClientConfig = {
  apiUrl: prodApiUrl,
  endpointOptions,
};

export const skipClientConfigAtom = atom<SkipClientOptions>({
  apiURL: defaultSkipClientConfig.apiUrl,
  endpointOptions: defaultSkipClientConfig.endpointOptions,
});

export const themeAtom = atom<Theme>(defaultTheme);

export const solanaWalletsAtom = atom<Wallet[]>();

export const skipClient = atom((get) => {
  const options = get(skipClientConfigAtom);
  const wallets = get(walletsAtom);
  const getSigners = get(getConnectedSignersAtom);

  const solanaWallets = get(solanaWalletsAtom);

  return new SkipClient({
    ...options,
    getCosmosSigner: async (chainID) => {
      if (getSigners?.getCosmosSigner) {
        return getSigners.getCosmosSigner(chainID);
      }
      if (!wallets.cosmos) {
        throw new Error("getCosmosSigner error: no cosmos wallet");
      }
      const wallet = getWallet(wallets.cosmos.walletName as WalletType);
      if (!wallet) {
        throw new Error("getCosmosSigner error: wallet not found");
      }
      const key = await wallet.getKey(chainID);

      return key.isNanoLedger
        ? wallet.getOfflineSignerOnlyAmino(chainID)
        : wallet.getOfflineSigner(chainID);
    },
    getEVMSigner: async (chainID) => {
      if (getSigners?.getEVMSigner) {
        return getSigners.getEVMSigner(chainID);
      }
      const evmWalletClient = (await getWalletClient(config, {
        chainId: parseInt(chainID),
      })) as WalletClient;

      return evmWalletClient;
    },
    getSVMSigner: async () => {
      if (getSigners?.getSVMSigner) {
        return getSigners.getSVMSigner();
      }
      const walletName = wallets.svm?.walletName;
      if (!walletName) throw new Error("getSVMSigner error: no svm wallet");
      const solanaWallet = solanaWallets?.find((w) => w.adapter.name === walletName)?.adapter;
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
      const chain = chains?.find((c) => c.chainID === asset.chainID);
      flattenedData.push({
        ...asset,
        chain_key: chainKey,
        chainName: chain?.prettyName ?? chain?.chainName ?? asset.chainID ?? "--",
      });
    });
  }

  return flattenedData;
};

export const onlyTestnetsAtom = atom<boolean | undefined>(undefined);

export const skipAssetsAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const chains = get(skipChainsAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipAssets", onlyTestnets, { onlyTestnets, apiURL, apiKey, cacheDurationMs }],
    queryFn: async () => {
      return skip
        .assets({
          includeEvmAssets: true,
          includeCW20Assets: true,
          includeSvmAssets: true,
          onlyTestnets,
        })
        .then((v) => flattenData(v, chains.data));
    },
  };
});

export const skipChainsAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipChains", { onlyTestnets, apiURL, apiKey, cacheDurationMs }],
    queryFn: async (): Promise<Chain[]> => {
      return skip.chains({
        includeEVM: true,
        includeSVM: true,
        onlyTestnets,
      });
    },
  };
});

export const skipBridgesAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  return {
    queryKey: ["skipBridges", { apiURL, apiKey, cacheDurationMs }],
    queryFn: async () => {
      return skip.bridges();
    },
  };
});

export const skipSwapVenuesAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const { apiURL, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipSwapVenue", { onlyTestnets, apiURL, apiKey, cacheDurationMs }],
    queryFn: async () => {
      return skip.venues(onlyTestnets);
    },
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
  const chainIDs = assets
    .filter((asset) => asset.symbol === assetSymbol)
    .map((asset) => asset.chainID);
  const chainsContainingAsset = chains
    .filter((chain) => chainIDs?.includes(chain.chainID))
    .map((chain) => {
      return {
        ...chain,
        asset: assets.find(
          (asset) => asset.chainID === chain.chainID && asset.symbol === assetSymbol,
        ),
      };
    });
  return chainsContainingAsset;
};
