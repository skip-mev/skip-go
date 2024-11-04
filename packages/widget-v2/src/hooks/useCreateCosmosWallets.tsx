import { getChainInfo } from "@/state/chains";
import { cosmosWalletAtom, MinimalWallet } from "@/state/wallets";
import {
  getWallet,
  useAccount,
  useActiveWalletType,
  useDisconnect,
  WalletType,
  connect,
} from "graz";
import { useAtomValue, useSetAtom } from "jotai";
import { createPenumbraClient } from "@penumbra-zone/client";
import { ViewService } from "@penumbra-zone/protobuf";
import { bech32mAddress } from "@penumbra-zone/bech32m/penumbra";
import { bech32CompatAddress } from "@penumbra-zone/bech32m/penumbracompat1";
import {
  getCosmosWalletInfo,
  keplrMainnetChainIdsInitialConnect,
  walletMainnetChainIdsInitialConnect,
  mainnetChains,
} from "@/constants/graz";
import { useCallback } from "react";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";

export const useCreateCosmosWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setCosmosWallet = useSetAtom(cosmosWalletAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const { walletType: currentWallet } = useActiveWalletType();

  const { data: accounts, isConnected } = useAccount({
    multiChain: true,
  });

  const { disconnectAsync } = useDisconnect();

  const createCosmosWallets = useCallback(
    (chainID?: string) => {
      const cosmosWallets = [WalletType.KEPLR, WalletType.LEAP, WalletType.COSMOSTATION, WalletType.XDEFI, WalletType.STATION, WalletType.VECTIS];

      const isPenumbra = chainID?.includes("penumbra");
      if (isPenumbra) {
        const praxWallet: MinimalWallet = {
          walletName: "prax",
          walletPrettyName: "Prax Wallet",
          walletChainType: "cosmos",
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
          },
          isWalletConnected: false,
        };
        return [praxWallet];
      }

      const wallets: MinimalWallet[] = [];

      for (const wallet of cosmosWallets) {

        const walletInfo = getCosmosWalletInfo(wallet);
        const initialChainIds = (
          wallet === WalletType.KEPLR
            ? keplrMainnetChainIdsInitialConnect
            : walletMainnetChainIdsInitialConnect
        ).filter(
          (x) =>
            chains
              ?.filter((z) => z.chainType === "cosmos")
              .map((y) => y.chainID)
              .includes(x) &&
            mainnetChains.map((c) => c.chainId).includes(x)
        );

        const connectEco = async () => {
          const promises = initialChainIds.map(
            async (c) =>
              await connect({
                chainId: c,
                walletType: wallet,
              })
          );
          await Promise.all(promises);
          return Promise.resolve();
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
            // @ts-expect-error mismatch keplr types version
            await getWallet(wallet).experimentalSuggestChain(chainInfo);
            const isInitialConnect = initialChainIds.includes(chainID);
            if (isInitialConnect) {
              await connectEco();
            } else {
              await connect({
                chainId: chainID,
                walletType: wallet,
              });
            }
            setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
          } else if (currentAddress && isConnected && signRequired) {
            setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
          }
          if (!currentAddress) {
            // @ts-expect-error mismatch keplr types version
            await getWallet(wallet).experimentalSuggestChain(chainInfo);
            const isInitialConnect = initialChainIds.includes(chainID);
            if (isInitialConnect) {
              await connectEco();
            } else {
              await connect({
                chainId: chainID,
                walletType: wallet,
              });
            }
            setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
          }
          const address = (await getWallet(wallet).getKey(chainID))
            .bech32Address;
          return address;
        };

        const minimalWallet: MinimalWallet = {
          walletName: wallet,
          walletPrettyName: walletInfo?.name,
          walletChainType: "cosmos",
          walletInfo: {
            logo: walletInfo?.imgSrc,
          },
          connectEco: async () => {
            await connectEco();
            setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
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
              // @ts-expect-error mismatch keplr types version
              await getWallet(wallet).experimentalSuggestChain(chainInfo);
              const isInitialConnect = initialChainIds.includes(chainID);
              if (isInitialConnect) {
                await connectEco();
              } else {
                await connect({
                  chainId: chainID,
                  walletType: wallet,
                });
              }
              setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
              connectEco();
              // TODO: onWalletConnected
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          getAddress,
          disconnect: async () => {
            await disconnectAsync();
            setCosmosWallet(undefined);
          },
          isWalletConnected: currentWallet === wallet,
          isAvailable: (() => {
            try {
              const w = getWallet(wallet);
              return Boolean(w);
            } catch (_error) {
              return false;
            }
          })()
        };
        wallets.push(minimalWallet);
      }
      return wallets;
    },
    [accounts, assets, chains, currentWallet, disconnectAsync, isConnected, setCosmosWallet, setSourceAsset]
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
