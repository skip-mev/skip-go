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
import { useAtom, useAtomValue } from "jotai";
import { createPenumbraClient } from "@penumbra-zone/client";
import { ViewService } from "@penumbra-zone/protobuf";
import { bech32mAddress } from "@penumbra-zone/bech32m/penumbra";
import { TransparentAddressRequest } from "@penumbra-zone/protobuf/penumbra/view/v1/view_pb";
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
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
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

        const connectWallet = async ({ chainIdToConnect }: { chainIdToConnect?: string }) => {
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

            if (sourceAsset === undefined) {
              const chain = chains?.find((x) => x.chainID === "cosmoshub-4");
              const asset = assets?.find((x) => x.denom === "uatom");
              setSourceAsset({
                chainID: chain?.chainID,
                chainName: chain?.chainName,
                ...asset,
              });
            }

            const chainIdToAddressMap: Record<string, string> = Object.fromEntries(
              Object.entries(response.accounts).map(([key, value]) => [key, value.bech32Address]),
            );
            const address = chainIdToConnect && response?.accounts[chainIdToConnect].bech32Address;

            callbacks?.onWalletConnected?.({
              walletName: wallet,
              chainIdToAddressMap: chainIdToAddressMap,
              address: address,
            });

            return { address };
          } catch (e) {
            const error = e as Error;
            if (error?.message?.toLowerCase().includes("no chain info")) {
              throw new Error(
                `There is no chain info for ${chainId}. Please add the ${chainId} chain to your wallet`,
              );
            }
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
            connectWallet({ chainIdToConnect: chainId });
          },
          disconnect: async () => {
            await disconnectAsync();
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
      chains,
      currentWallet,
      sourceAsset,
      assets,
      setSourceAsset,
      disconnectAsync,
      setCosmosWallet,
      cosmosWallet,
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
        // To deposit into penumbra, we generate an ephemeral address
        // this is a randomized address that is generated for each deposit.
        //
        // Noble Mainnet is the exception to this rule.
        // If the chain is noble-1, we use a transparent address.
        // This means that the address is the same for all deposits.
        //
        // Note: once Noble upgrades their network, this special casing can be removed.
        // And all addresses can be ephemeral with bech32m encoding.
        if (sourceChainID === "noble-1") {
          const address = await viewService.transparentAddress(new TransparentAddressRequest({}));
          if (!address.address) throw new Error("No address found");
          // The view service did the work of encoding the address for us.
          return { address: address.encoding };
        } else {
          const ephemeralAddress = await viewService.ephemeralAddress({
            addressIndex: {
              account: penumbraWalletIndex ? penumbraWalletIndex : 0,
            },
          });
          if (!ephemeralAddress.address) throw new Error("No address found");
          return { address: bech32mAddress(ephemeralAddress.address) };
        }
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
