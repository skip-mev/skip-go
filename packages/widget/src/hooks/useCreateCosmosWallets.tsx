import { cosmosWalletAtom, MinimalWallet } from "@/state/wallets";
import {
  getWallet,
  useActiveWalletType,
  useDisconnect,
  WalletType,
  connect,
  isWalletConnect,
  checkWallet,
} from "graz";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { createPenumbraClient } from "@penumbra-zone/client";
import { ViewService } from "@penumbra-zone/protobuf";
import { bech32mAddress } from "@penumbra-zone/bech32m/penumbra";
import { Chain, ChainType } from "@skip-go/client";
import {
  getCosmosWalletInfo,
  keplrMainnetWithoutEthermintChainIdsInitialConnect,
  keplrMainnetChainIdsInitialConnect,
  walletMainnetChainIdsInitialConnect,
  okxWalletChainIdsInitialConnect,
} from "@/constants/graz";
import { mainnetChains, getChainInfo } from "@/constants/chains";
import { useCallback } from "react";
import { skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { isMobile } from "@/utils/os";
import { callbacksAtom, onWalletDisconnectedProps } from "@/state/callbacks";
import { track } from "@amplitude/analytics-browser";
import { useUpdateSourceAssetToDefaultForChainType } from "./useUpdateSourceAssetToDefaultForChainType";
import { atomWithStorage } from "jotai/utils";
import { LOCAL_STORAGE_KEYS } from "@/state/localStorageKeys";

export const useCreateCosmosWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const { walletType: currentWallet } = useActiveWalletType();
  const extraCosmosChainIdsToConnectPerWallet = useAtomValue(
    extraCosmosChainIdsToConnectPerWalletAtom,
  );
  const addExtraChainIdsToConnectForWalletType = useSetAtom(
    addExtraChainIdsToConnectForWalletTypeAtom,
  );
  const clearCosmosChainIdsToConnectForWalletType = useSetAtom(
    clearCosmosChainIdsToConnectForWalletTypeAtom,
  );

  const setDefaultSourceAsset = useUpdateSourceAssetToDefaultForChainType();

  const { disconnectAsync } = useDisconnect();

  const createCosmosWallets = useCallback(
    (chainId?: string) => {
      const mobile = isMobile();

      const cosmosWallets = getAvailableWallets();

      const isPenumbra = chainId?.includes("penumbra");
      if (isPenumbra && !mobile) {
        return handlePenumbraNetwork(callbacks?.onWalletDisconnected);
      }

      const wallets: MinimalWallet[] = [];

      for (const wallet of cosmosWallets) {
        const isWC = isWalletConnect(wallet);
        const mobile = isMobile();
        const walletInfo = getCosmosWalletInfo(wallet);
        const initialChainIds = filterValidChainIds(
          [...getInitialChainIds(wallet), ...(extraCosmosChainIdsToConnectPerWallet[wallet] ?? [])],
          chains,
        );

        const connectWallet = async ({ chainIdToConnect }: { chainIdToConnect?: string }) => {
          const connectToInitialChainId =
            !chainIdToConnect || (chainIdToConnect && initialChainIds.includes(chainIdToConnect));

          try {
            if (chainIdToConnect) {
              const chainInfo = getChainInfo(chainIdToConnect);
              if (!chainInfo)
                throw new Error(`connect: Chain info not found for chainId: ${chainId}`);
              if (!mobile && !isWC) {
                await getWallet(wallet).experimentalSuggestChain(chainInfo);
                addExtraChainIdsToConnectForWalletType({
                  walletName: wallet,
                  chainId: chainIdToConnect,
                });
              }
            }

            const response = await connect({
              chainId: connectToInitialChainId
                ? initialChainIds
                : [...initialChainIds, chainIdToConnect],
              walletType: wallet,
              autoReconnect: false,
            });

            if (!response?.accounts) {
              throw new Error("failed to get accounts from wallet");
            }

            if (sourceAsset === undefined) {
              setDefaultSourceAsset(ChainType.Cosmos);
            }

            const chainIdToAddressMap: Record<string, string> = Object.fromEntries(
              Object.entries(response.accounts).map(([key, value]) => [key, value.bech32Address]),
            );
            const address = chainIdToConnect && response?.accounts[chainIdToConnect].bech32Address;

            if (cosmosWallet === undefined) {
              callbacks?.onWalletConnected?.({
                walletName: wallet,
                chainIdToAddressMap: chainIdToAddressMap,
                address: address,
              });
              const currentCosmosId =
                response?.accounts[Object.keys(response?.accounts)[0]]?.bech32Address;

              setCosmosWallet({
                id: currentCosmosId,
                walletName: wallet,
                chainType: ChainType.Cosmos,
              });
            }

            track("wallet connected", {
              walletName: wallet,
              chainId: chainIdToConnect,
              chainType: ChainType.Cosmos,
              address,
            });

            return { address };
          } catch (e) {
            const error = e as Error;
            track("connect wallet error", {
              walletName: wallet,
              chainId: chainIdToConnect,
              ChainType: ChainType.Cosmos,
              errorMessage: error?.message,
            });

            if (error?.message?.toLowerCase().includes("no ethereum public key")) {
              const response = await connect({
                chainId: keplrMainnetWithoutEthermintChainIdsInitialConnect,
                walletType: wallet,
                autoReconnect: false,
              });
              return {
                address: chainIdToConnect
                  ? response?.accounts[chainIdToConnect].bech32Address
                  : undefined,
              };
            }

            if (extraCosmosChainIdsToConnectPerWallet[wallet].length > 0) {
              clearCosmosChainIdsToConnectForWalletType(wallet);

              const retryChainIds = filterValidChainIds([...getInitialChainIds(wallet)], chains);

              const response = await connect({
                chainId: connectToInitialChainId
                  ? retryChainIds
                  : [...retryChainIds, chainIdToConnect],
                walletType: wallet,
                autoReconnect: false,
              });
              const address =
                chainIdToConnect && response?.accounts[chainIdToConnect].bech32Address;
              return { address };
            }

            if (error?.message?.toLowerCase().includes("no chain info")) {
              throw new Error(
                `There is no chain info for ${chainIdToConnect}. Please add the ${chainIdToConnect} chain to your wallet`,
              );
            }
            throw e;
          }
        };

        const minimalWallet: MinimalWallet = {
          walletName: wallet,
          walletPrettyName: walletInfo?.name,
          walletChainType: ChainType.Cosmos,
          walletInfo: {
            logo: walletInfo?.imgSrc,
          },
          connect: async (chainId) => {
            await connectWallet({ chainIdToConnect: chainId });
          },
          disconnect: async () => {
            await disconnectAsync();
            track("wallet disconnected", {
              walletName: wallet,
              ChainType: ChainType.Cosmos,
            });
            setCosmosWallet(undefined);
            callbacks?.onWalletDisconnected?.({
              walletName: wallet,
              chainType: ChainType.Cosmos,
            });
          },
          getAddress: async ({ signRequired }) => {
            try {
              const getAddressWithoutConnectingWallet = cosmosWallet && !signRequired && chainId;

              if (getAddressWithoutConnectingWallet) {
                const address = (await getWallet(wallet).getKey(chainId)).bech32Address;
                return { address };
              }

              throw new Error("connect wallet");
            } catch (_error) {
              return connectWallet({ chainIdToConnect: chainId });
            }
          },
          isWalletConnected: currentWallet === wallet,
          isAvailable: (() => {
            if (mobile) return undefined;
            try {
              const w = getWallet(wallet);
              return Boolean(w);
            } catch (_error) {
              return false;
            }
          })(),
        };
        wallets.push(minimalWallet);
      }
      return wallets;
    },
    [
      callbacks,
      extraCosmosChainIdsToConnectPerWallet,
      chains,
      currentWallet,
      sourceAsset,
      cosmosWallet,
      addExtraChainIdsToConnectForWalletType,
      setDefaultSourceAsset,
      setCosmosWallet,
      clearCosmosChainIdsToConnectForWalletType,
      disconnectAsync,
    ],
  );

  return { createCosmosWallets };
};

export const extraCosmosChainIdsToConnectPerWalletAtom = atomWithStorage<Record<string, string[]>>(
  LOCAL_STORAGE_KEYS.extraCosmosChainIdsToConnectPerWallet,
  {},
);

export const addExtraChainIdsToConnectForWalletTypeAtom = atom(
  null,
  (_get, set, { walletName, chainId }: { walletName: string; chainId: string }) => {
    set(extraCosmosChainIdsToConnectPerWalletAtom, (prev) => {
      if (!prev[walletName]) {
        prev[walletName] = [];
      }
      if (
        chainId &&
        !prev[walletName].includes(chainId) &&
        !getInitialChainIds(walletName as WalletType).includes(chainId)
      ) {
        prev[walletName].push(chainId);
      }

      return prev;
    });
  },
);

export const clearCosmosChainIdsToConnectForWalletTypeAtom = atom(
  null,
  (_get, set, wallet: WalletType) => {
    set(extraCosmosChainIdsToConnectPerWalletAtom, (prev) => {
      const newState = { ...prev };
      if (newState[wallet]) {
        newState[wallet] = [];
      }
      return newState;
    });
  },
);

export const getInitialChainIds = (wallet: WalletType) => {
  const isWC = isWalletConnect(wallet);
  const mobile = isMobile();

  if (isWC) return keplrMainnetChainIdsInitialConnect.filter((chainId) => chainId !== "wormchain");

  switch (wallet) {
    case WalletType.OKX:
      return okxWalletChainIdsInitialConnect;
    case WalletType.KEPLR:
      return mobile
        ? keplrMainnetChainIdsInitialConnect.filter((chainId) => chainId !== "wormchain")
        : keplrMainnetChainIdsInitialConnect;
    default:
      return walletMainnetChainIdsInitialConnect;
  }
};

const filterValidChainIds = (chainIds: string[], chains?: Chain[]) => {
  const cosmosChainIds = chains
    ?.filter((chain) => chain.chainType === ChainType.Cosmos)
    .map((chain) => chain.chainId);

  const mainnetChainIds = mainnetChains.map((chain) => chain.chainId);

  return chainIds.filter(
    (chainId) => cosmosChainIds?.includes(chainId) && mainnetChainIds.includes(chainId),
  );
};

const getAvailableWallets = () => {
  const mobile = isMobile();

  const browserWallets = [
    WalletType.KEPLR,
    WalletType.LEAP,
    WalletType.COSMOSTATION,
    WalletType.XDEFI,
    WalletType.STATION,
    WalletType.VECTIS,
    WalletType.WALLETCONNECT,
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== "undefined" && window.keplr && (window?.keplr as any).isOkxWallet) {
    browserWallets[0] = WalletType.OKX;
  }

  const isIframeAvailable = checkWallet(WalletType.COSMIFRAME);
  if (isIframeAvailable) {
    browserWallets.push(WalletType.COSMIFRAME);
  }
  const mobileCosmosWallets = [WalletType.WC_KEPLR_MOBILE];
  const availableMobileCosmosWallets = [...browserWallets, ...mobileCosmosWallets].filter(
    (wallet) => {
      try {
        const keplrWalletExists = checkWallet(WalletType.KEPLR);
        if (
          mobile &&
          [WalletType.WC_KEPLR_MOBILE, WalletType.WALLETCONNECT].includes(wallet) &&
          keplrWalletExists
        ) {
          return false;
        }
        return Boolean(getWallet(wallet));
      } catch (_error) {
        return false;
      }
    },
  );
  return mobile ? availableMobileCosmosWallets : browserWallets;
};

const handlePenumbraNetwork = (
  onWalletDisconnected: ((props: onWalletDisconnectedProps) => void) | undefined,
) => {
  const praxWallet: MinimalWallet = {
    walletName: "prax",
    walletPrettyName: "Prax Wallet",
    walletChainType: ChainType.Cosmos,
    walletInfo: {
      logo: "https://raw.githubusercontent.com/prax-wallet/web/e8b18f9b997708eab04f57e7a6c44f18b3cf13a8/apps/extension/public/prax-white-vertical.svg",
    },
    connect: async () => {
      console.error("Prax wallet is not supported");
      throw new Error("Prax wallet is not supported");
    },
    getAddress: async ({ praxWallet }) => {
      const penumbraSubaccountIndex = praxWallet?.index;
      const prax_id = "lkpmkhpnhknhmibgnmmhdhgdilepfghe";
      const prax_origin = `chrome-extension://${prax_id}`;
      const client = createPenumbraClient(prax_origin);
      try {
        await client.connect();
        const viewService = client.service(ViewService);
        // To deposit into penumbra, we generate an "ephemeral address",
        // this is an address that is generated for each deposit,
        // randomized each time, but tied to the same wallet.
        const ephemeralAddress = await viewService.ephemeralAddress({
          addressIndex: {
            // This is the subaccount of the wallet.
            // Default is zero.
            account: penumbraSubaccountIndex ? penumbraSubaccountIndex : 0,
          },
        });
        if (!ephemeralAddress.address) throw new Error("No address found");
        return { address: bech32mAddress(ephemeralAddress.address) };
      } catch (e) {
        const error = e as Error;
        track("get address error", {
          walletName: "prax",
          ChainType: ChainType.Cosmos,
          chainId: "penumbra",
          errorMessage: error?.message,
        });
        console.error(error);
        throw error;
      }
    },
    disconnect: async () => {
      console.error("Prax wallet is not supported");
      onWalletDisconnected?.({
        walletName: "Prax Wallet",
        chainType: ChainType.Cosmos,
      });
      throw new Error("Prax wallet is not supported");
    },
    isWalletConnected: false,
  };
  return [praxWallet];
};
