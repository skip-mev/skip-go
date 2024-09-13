import { getChainInfo } from "@/state/chains";
import { cosmosWalletAtom, MinimalWallet } from "@/state/wallets";
import { getAvailableWallets, useAccount, useActiveWalletType, useDisconnect, useSuggestChainAndConnect, WalletType } from "graz";
import { useSetAtom } from "jotai";
import { createPenumbraClient } from "@penumbra-zone/client";
import { ViewService } from "@penumbra-zone/protobuf";
import { bech32mAddress } from "@penumbra-zone/bech32m/penumbra";
import { bech32CompatAddress } from "@penumbra-zone/bech32m/penumbracompat1";
import { getWalletInfo } from "@/constants/graz";

export const useCreateCosmosWallets = () => {
  const setCosmosWallet = useSetAtom(cosmosWalletAtom)
  const _availableWallets = getAvailableWallets()
  const comsosWallets = Object.entries(_availableWallets).filter(([_, value]) => value).map(([key]) => key) as WalletType[]
  const { walletType: currentWallet } = useActiveWalletType()
  const { suggestAndConnectAsync } = useSuggestChainAndConnect()
  const { data: accounts, isConnected } = useAccount({
    multiChain: true,
  })
  const { disconnectAsync } = useDisconnect()

  const createCosmosWallets = (chainID: string) => {
    const isPenumbra = chainID.includes("penumbra")
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
          }
        },
        disconnect: async () => {
          console.error("Prax wallet is not supported");
        },
        isWalletConnected: false,
      };
      return [praxWallet];
    }

    const wallets: MinimalWallet[] = []
    const currentAddress = accounts?.[chainID]?.bech32Address
    const chainInfo = getChainInfo(chainID)

    for (const wallet of comsosWallets) {

      const getAddress = async ({ signRequired }: { signRequired?: boolean; context?: "recovery" | "destination" }) => {
        if (wallet !== currentWallet) {
          if (!chainInfo) throw new Error(`getAddress: Chain info not found for chainID: ${chainID}`)
          await suggestAndConnectAsync({ walletType: wallet, chainInfo });
          setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
        } else if (currentAddress && isConnected && signRequired) {
          setCosmosWallet({ walletName: wallet, chainType: "cosmos" });
        }
        return currentAddress;
      }
      const walletInfo = getWalletInfo(wallet)
      const minimalWallet: MinimalWallet = {
        walletName: wallet,
        walletPrettyName: walletInfo.name,
        walletChainType: "cosmos",
        walletInfo: {
          logo: walletInfo.imgSrc
        },
        connect: async () => {
          if (wallet === currentWallet) return
          try {
            if (!chainInfo) throw new Error(`connect: Chain info not found for chainID: ${chainID}`)
            await suggestAndConnectAsync({ walletType: wallet, chainInfo })
            setCosmosWallet({ walletName: wallet, chainType: "cosmos" })
            // TODO: onWalletConnected
          } catch (error) {
            console.error(error)
            throw error
          }
        },
        getAddress,
        disconnect: async () => {
          await disconnectAsync({
            chainId: chainID
          })
        },
        isWalletConnected: currentWallet === wallet
      }
      wallets.push(minimalWallet)
    }
  }
  return createCosmosWallets
}

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
