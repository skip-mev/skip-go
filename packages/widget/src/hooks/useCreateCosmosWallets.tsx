import { cosmosWalletAtom, MinimalWallet } from "@/state/wallets";
import {
  getWallet,
  useAccount,
  useActiveWalletType,
  useDisconnect,
  WalletType,
  connect,
  isWalletConnect,
  checkWallet,
} from "graz";
import { useAtomValue, useSetAtom } from "jotai";
import { createPenumbraClient } from "@penumbra-zone/client";
import { ViewService } from "@penumbra-zone/protobuf";
import { bech32mAddress } from "@penumbra-zone/bech32m/penumbra";
import { bech32CompatAddress } from "@penumbra-zone/bech32m/penumbracompat1";
import { ChainType } from "@skip-go/client";
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
import { callbacksAtom } from "@/state/callbacks";

export const useCreateCosmosWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setCosmosWallet = useSetAtom(cosmosWalletAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const { walletType: currentWallet } = useActiveWalletType();

  const { data: accounts, isConnected } = useAccount({
    multiChain: true,
  });

  const { disconnectAsync } = useDisconnect();

  const createCosmosWallets = useCallback(
    (chainID?: string) => {
      const mobile = isMobile();

      const isIframeAvailable = checkWallet(WalletType.COSMIFRAME);
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
      if ((window?.keplr as any).isOkxWallet) {
        browserWallets[0] = WalletType.OKX;
      }

      if (isIframeAvailable) {
        browserWallets.push(WalletType.COSMIFRAME);
      }
      const mobileCosmosWallets = [WalletType.WC_KEPLR_MOBILE];
      const availableMobileCosmosWallets = [
        ...browserWallets,
        ...mobileCosmosWallets,
      ].filter((x) => {
        try {
          return Boolean(getWallet(x));
        } catch (_error) {
          return false;
        }
      });
      const cosmosWallets = mobile
        ? availableMobileCosmosWallets
        : browserWallets;

      const isPenumbra = chainID?.includes("penumbra");
      if (isPenumbra && !mobile) {
        const praxWallet: MinimalWallet = {
          walletName: "prax",
          walletPrettyName: "Prax Wallet",
          walletChainType: ChainType.Cosmos,
          walletInfo: {
            logo: "https://raw.githubusercontent.com/prax-wallet/web/e8b18f9b997708eab04f57e7a6c44f18b3cf13a8/apps/extension/public/prax-white-vertical.svg",
          },
          connectEco: async () => {
            console.error("Prax wallet is not supported for connectEco");
          },
          connect: async () => {
            console.error("Prax wallet is not supported for connect");
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
            callbacks?.onWalletDisconnected?.({
              walletName: "Prax Wallet",
              chainType: ChainType.Cosmos,
            });
          },
          isWalletConnected: false,
        };
        return [praxWallet];
      }

      const wallets: MinimalWallet[] = [];

      for (const wallet of cosmosWallets) {
        const isWC = isWalletConnect(wallet);
        const mobile = isMobile();
        const walletInfo = getCosmosWalletInfo(wallet);
        const initialChainIds = (() => {
          if (isWC) return walletConnectMainnetChainIdsInitialConnect;
          if (wallet === WalletType.OKX) return okxWalletChainIdsInitialConnect;
          if (wallet === WalletType.KEPLR && !mobile) return keplrMainnetChainIdsInitialConnect;
          return walletMainnetChainIdsInitialConnect;
        })().filter(
          (x) =>
            chains
              ?.filter((z) => z.chainType === ChainType.Cosmos)
              .map((y) => y.chainID)
              .includes(x) && mainnetChains.map((c) => c.chainId).includes(x)
        );
        const connectEco = async () => {
          try {
            await connect({
              chainId: initialChainIds,
              walletType: wallet,
              autoReconnect: false,
            });
          } catch (e) {
            const error = e as Error;
            if (error?.message?.toLowerCase().includes("no chain info")) {
              throw new Error(
                `There is no chain info for ${chainID}. Please add the ${chainID} chain to your wallet`
              );
            }
            if (
              error?.message?.toLowerCase().includes("no ethereum public key")
            ) {
              await connect({
                chainId: keplrMainnetWithoutEthermintChainIdsInitialConnect,
                walletType: wallet,
                autoReconnect: false,
              });
              return Promise.resolve();
            }
            throw e;
          }
        };

        const connectSingleChainId = async () => {
          try {
            if (!chainID) throw new Error("Chain ID is required");
            await connect({
              chainId: chainID,
              walletType: wallet,
              autoReconnect: false,
            });
          } catch (e) {
            const error = e as Error;
            if (error?.message?.toLowerCase().includes("no chain info")) {
              throw new Error(
                `There is no chain info for ${chainID}. Please add ${chainID} chain in your wallet`
              );
            }
            throw e;
          }
        };

        const getAddress = async ({
          signRequired,
        }: {
          signRequired?: boolean;
          context?: "recovery" | "destination";
        }) => {
          if (!chainID) throw new Error("Chain ID is required");
          const chainInfo = getChainInfo(chainID);
          const currentAddress = accounts?.[chainID]?.bech32Address;
          if (wallet !== currentWallet && !currentAddress) {
            if (!chainInfo)
              throw new Error(
                `getAddress: Chain info not found for chainID: ${chainID}`
              );
            if (!mobile && !isWC) {
              await getWallet(wallet).experimentalSuggestChain(chainInfo);
            }
            const isInitialConnect = initialChainIds.includes(chainID);
            if (isInitialConnect) {
              await connectEco();
            } else {
              await connectSingleChainId();
            }
            setCosmosWallet({
              walletName: wallet,
              chainType: ChainType.Cosmos,
            });
          } else if (currentAddress && isConnected && signRequired) {
            setCosmosWallet({
              walletName: wallet,
              chainType: ChainType.Cosmos,
            });
          }
          if (!currentAddress) {
            if (!mobile && !isWC) {
              if (!chainInfo)
                throw new Error(
                  `getAddress: Chain info not found for chainID: ${chainID}`
                );
              await getWallet(wallet).experimentalSuggestChain(chainInfo);
            }
            const isInitialConnect = initialChainIds.includes(chainID);
            if (isInitialConnect) {
              await connectEco();
            } else {
              await connectSingleChainId();
            }
            setCosmosWallet({
              walletName: wallet,
              chainType: ChainType.Cosmos,
            });
          }
          const address = (await getWallet(wallet).getKey(chainID))
            .bech32Address;
          return address;
        };

        const minimalWallet: MinimalWallet = {
          walletName: wallet,
          walletPrettyName: walletInfo?.name,
          walletChainType: ChainType.Cosmos,
          walletInfo: {
            logo: walletInfo?.imgSrc,
          },
          connectEco: async () => {
            await connectEco();
            setCosmosWallet({
              walletName: wallet,
              chainType: ChainType.Cosmos,
            });
            const chain = chains?.find((x) => x.chainID === "cosmoshub-4");
            const asset = assets?.find((x) => x.denom === "uatom");
            setSourceAsset({
              chainID: chain?.chainID,
              chainName: chain?.chainName,
              ...asset,
            });
            return Promise.resolve();
          },
          connect: async () => {
            try {
              if (!chainID) throw new Error("Chain ID is required");
              const chainInfo = getChainInfo(chainID);
              if (!chainInfo)
                throw new Error(
                  `connect: Chain info not found for chainID: ${chainID}`
                );
              if (!mobile && !isWC) {
                await getWallet(wallet).experimentalSuggestChain(chainInfo);
              }
              const isInitialConnect = initialChainIds.includes(chainID);
              if (isInitialConnect) {
                await connectEco();

                const chainIdToAddressMap = Object.fromEntries(
                  await Promise.all(
                    initialChainIds.map(async (chainId) => [
                      chainId,
                      (await getWallet(wallet).getKey(chainId)).bech32Address,
                    ])
                  )
                );

                callbacks?.onWalletConnected?.({
                  walletName: wallet,
                  chainIdToAddressMap,
                });

              } else {
                await connectSingleChainId();
                const address = (await getWallet(wallet).getKey(chainID))
                  .bech32Address;
                callbacks?.onWalletConnected?.({
                  walletName: wallet,
                  chainId: chainID,
                  address,
                });
              }
              setCosmosWallet({
                walletName: wallet,
                chainType: ChainType.Cosmos,
              });
              connectEco();
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          getAddress,
          disconnect: async () => {
            await disconnectAsync();
            setCosmosWallet(undefined);
            callbacks?.onWalletDisconnected?.({
              walletName: wallet,
              chainType: ChainType.Cosmos,
            });
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
      accounts,
      callbacks,
      assets,
      chains,
      currentWallet,
      disconnectAsync,
      isConnected,
      setCosmosWallet,
      setSourceAsset,
    ]
  );

  return { createCosmosWallets };
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
