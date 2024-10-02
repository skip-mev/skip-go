import { getChainInfo } from "@/state/chains";
import { cosmosWalletAtom, MinimalWallet } from "@/state/wallets";
import { getAvailableWallets, getWallet, useAccount, useActiveWalletType, useDisconnect, WalletType, connect } from "graz";
import { useSetAtom } from "jotai";
import { createPenumbraClient } from "@penumbra-zone/client";
import { ViewService } from "@penumbra-zone/protobuf";
import { bech32mAddress } from "@penumbra-zone/bech32m/penumbra";
import { bech32CompatAddress } from "@penumbra-zone/bech32m/penumbracompat1";
import { getCosmosWalletInfo } from "@/constants/graz";
import { useCallback } from "react";

export const useCreateCosmosWallets = () => {
  const setCosmosWallet = useSetAtom(cosmosWalletAtom);
  const _availableWallets = getAvailableWallets();
  const cosmosWallets = Object.entries(_availableWallets).filter(([_, value]) => value).map(([key]) => key) as WalletType[];
  const { walletType: currentWallet } = useActiveWalletType();

  const { data: accounts, isConnected } = useAccount({
    multiChain: true,
  });

  const { disconnectAsync } = useDisconnect();

  const createCosmosWallets = useCallback((chainID: string) => {
    const isPenumbra = chainID.includes("penumbra");
    if (isPenumbra) {
      const praxWallet: MinimalWallet = {
        walletName: "prax",
        walletPrettyName: "Prax Wallet",
        walletChainType: "cosmos",
        walletInfo: {
          logo: "https://raw.githubusercontent.com/prax-wallet/web/e8b18f9b997708eab04f57e7a6c44f18b3cf13a8/apps/extension/public/prax-white-vertical.svg",
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
    const currentAddress = accounts?.[chainID]?.bech32Address;
    const chainInfo = getChainInfo(chainID);

    for (const wallet of cosmosWallets) {
      const getAddress = async ({ signRequired }: { signRequired?: boolean; context?: "recovery" | "destination" }) => {
        if (wallet !== currentWallet || !currentAddress) {
          if (!chainInfo) throw new Error(`getAddress: Chain info not found for chainID: ${chainID}`);
          // @ts-expect-error mismatch keplr types version
          await getWallet(wallet).experimentalSuggestChain(chainInfo);
          await connect({
            chainId: chainID,
            walletType: wallet
          });
          setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
        } else if (currentAddress && isConnected && signRequired) {
          setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
        }
        const address = (await getWallet(wallet).getKey(chainID)).bech32Address;
        return address;
      };
      const walletInfo = getCosmosWalletInfo(wallet);
      const minimalWallet: MinimalWallet = {
        walletName: wallet,
        walletPrettyName: walletInfo.name,
        walletChainType: "cosmos",
        walletInfo: {
          logo: walletInfo.imgSrc
        },
        connect: async () => {
          try {
            if (!chainInfo) throw new Error(`connect: Chain info not found for chainID: ${chainID}`);
            // @ts-expect-error mismatch keplr types version
            await getWallet(wallet).experimentalSuggestChain(chainInfo);
            await connect({
              chainId: chainID,
              walletType: wallet
            });
            setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
            // TODO: onWalletConnected
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        getAddress,
        disconnect: async () => {
          await disconnectAsync();
        },
        isWalletConnected: currentWallet === wallet
      };
      wallets.push(minimalWallet);
    }
    return wallets;
  }, [accounts, cosmosWallets, currentWallet, disconnectAsync, isConnected, setCosmosWallet]);

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
