import { cosmosWalletAtom, MinimalWallet } from "@/state/wallets";
import {
  getWallet,
  useActiveWalletType,
  useDisconnect,
  WalletType,
  connect,
  isWalletConnect,
  checkWallet,
  Key,
} from "graz";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createPenumbraClient } from "@penumbra-zone/client";
import { ViewService } from "@penumbra-zone/protobuf";
import { bech32mAddress } from "@penumbra-zone/bech32m/penumbra";
import { bech32CompatAddress } from "@penumbra-zone/bech32m/penumbracompat1";
import { Chain, ChainType } from "@skip-go/client";
import {
  getCosmosWalletInfo,
  keplrMainnetWithoutEthermintChainIdsInitialConnect,
  keplrMainnetChainIdsInitialConnect,
  walletConnectMainnetChainIdsInitialConnect,
  walletMainnetChainIdsInitialConnect,
  okxWalletChainIdsInitialConnect,
} from "@/constants/graz";
import { mainnetChains, getChainInfo } from "@/constants/chains";
import { useCallback } from "react";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { isMobile } from "@/utils/os";
import { callbacksAtom, OnWalletDisconnectedProps } from "@/state/callbacks";

export const useCreateCosmosWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setCosmosWallet = useSetAtom(cosmosWalletAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const { walletType: currentWallet } = useActiveWalletType();

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
        const initialChainIds = filterValidChainIds(getInitialChainIds(wallet), chains);

        const updateWalletState = (addressMap: Record<string, Key>) => {
          setCosmosWallet({
            walletName: wallet,
            walletPrettyName: walletInfo?.name,
            walletChainType: ChainType.Cosmos,
            walletInfo: {
              logo: walletInfo?.imgSrc,
            },
            addressMap: addressMap,
          });
        };

        const connectWallet = async (chainIdToConnect?: string) => {
          const connectToInitialChainId =
            !chainIdToConnect || (chainIdToConnect && initialChainIds.includes(chainIdToConnect));
          try {
            if (chainIdToConnect) {
              const chainInfo = getChainInfo(chainIdToConnect);
              if (!chainInfo)
                throw new Error(`connect: Chain info not found for chainID: ${chainId}`);
              if (!mobile && !isWC) {
                await getWallet(wallet).experimentalSuggestChain(chainInfo);
              }
            }

            const response = await connect({
              chainId: connectToInitialChainId ? initialChainIds : chainIdToConnect,
              walletType: wallet,
              autoReconnect: false,
            });

            if (!response?.accounts) {
              throw new Error("failed to get accounts from wallet");
            }

            updateWalletState(response.accounts);

            if (sourceAsset === undefined) {
              const chain = chains?.find((x) => x.chainID === "cosmoshub-4");
              const asset = assets?.find((x) => x.denom === "uatom");
              setSourceAsset({
                chainID: chain?.chainID,
                chainName: chain?.chainName,
                ...asset,
              });
            }

            const chainIdToAddressMap = Object.fromEntries(
              await Promise.all(
                initialChainIds.map(async (chainId) => [
                  chainId,
                  (await getWallet(wallet).getKey(chainId)).bech32Address,
                ]),
              ),
            );
            let address = undefined;

            if (chainIdToConnect) {
              address = (await getWallet(wallet).getKey(chainIdToConnect ?? "")).bech32Address;
            }

            callbacks?.onWalletConnected?.({
              walletName: wallet,
              chainIdToAddressMap,
              address,
            });

            return address;
          } catch (e) {
            const error = e as Error;
            if (error?.message?.toLowerCase().includes("no chain info")) {
              throw new Error(
                `There is no chain info for ${chainId}. Please add the ${chainId} chain to your wallet`,
              );
            }
            if (error?.message?.toLowerCase().includes("no ethereum public key")) {
              await connect({
                chainId: keplrMainnetWithoutEthermintChainIdsInitialConnect,
                walletType: wallet,
                autoReconnect: false,
              });
              return Promise.resolve(undefined);
            }
            throw e;
          } finally {
            window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
          }
        };

        const minimalWallet: MinimalWallet = {
          walletName: wallet,
          walletPrettyName: walletInfo?.name,
          walletChainType: ChainType.Cosmos,
          walletInfo: {
            logo: walletInfo?.imgSrc,
          },
          connect: async (chainId) => connectWallet(chainId),
          disconnect: async () => {
            await disconnectAsync();
            setCosmosWallet(undefined);
            callbacks?.onWalletDisconnected?.({
              walletName: wallet,
              chainType: ChainType.Cosmos,
            });
          },
          getAddress: async ({ chainId }) => {
            const walletIsConnected = currentWallet === wallet;
            console.log("get address", walletIsConnected, chainId);
            if (walletIsConnected && chainId) {
              return (await getWallet(wallet).getKey(chainId)).bech32Address;
            }
            return connectWallet(chainId);
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
      currentWallet,
      chains,
      setCosmosWallet,
      sourceAsset,
      assets,
      setSourceAsset,
      disconnectAsync,
    ],
  );

  return { createCosmosWallets };
};

const getInitialChainIds = (wallet: WalletType) => {
  const isWC = isWalletConnect(wallet);
  const mobile = isMobile();

  if (isWC) return walletConnectMainnetChainIdsInitialConnect;

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
    .map((chain) => chain.chainID);

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

const penumbraBech32ChainIDs = ["noble-1", "grand-1"];
const getPenumbraCompatibleAddress = ({
  chainID,
  address,
}: {
  chainID?: string;
  address: { inner: Uint8Array };
}): string => {
  if (!chainID) return bech32mAddress(address);
  return penumbraBech32ChainIDs.includes(chainID)
    ? bech32CompatAddress(address)
    : bech32mAddress(address);
};

const handlePenumbraNetwork = (
  onWalletDisconnected: ((props: OnWalletDisconnectedProps) => void) | undefined,
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
      const penumbraWalletIndex = praxWallet?.index;
      const sourceChainID = praxWallet?.sourceChainID;
      const prax_id = "lkpmkhpnhknhmibgnmmhdhgdilepfghe";
      const prax_origin = `chrome-extension://${prax_id}`;
      const client = createPenumbraClient(prax_origin);
      try {
        await client.connect();

        const viewService = client.service(ViewService);
        const address = await viewService.ephemeralAddress({
          addressIndex: {
            account: penumbraWalletIndex ? penumbraWalletIndex : 0,
          },
        });
        if (!address.address) throw new Error("No address found");
        const bech32Address = getPenumbraCompatibleAddress({
          address: address.address,
          chainID: sourceChainID,
        });
        return bech32Address;
      } catch (error) {
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
