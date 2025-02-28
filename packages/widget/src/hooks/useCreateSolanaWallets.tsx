import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import {
  MinimalWallet,
  setWalletConnectDeepLinkByChainTypeAtom,
  svmWalletAtom,
  WalletConnectMetaData,
} from "@/state/wallets";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { ChainType } from "@skip-go/client";
import { callbacksAtom } from "@/state/callbacks";
import { walletConnectLogo } from "@/constants/wagmi";
import { useWallet } from "@solana/wallet-adapter-react";

export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const setWCDeepLinkByChainType = useSetAtom(setWalletConnectDeepLinkByChainTypeAtom);
  const { wallets: solanaWallets } = useWallet();

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const solWallet of solanaWallets) {
      const wallet = solWallet.adapter;
      const isWalletConnect = wallet.name === "WalletConnect";

      const connectWallet = async () => {
        try {
          await wallet.connect();
          const chain = chains?.find((x) => x.chainID === "solana");
          const asset = assets?.find(
            (x) =>
              x.denom.toLowerCase() ===
              "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase(),
          );

          if (sourceAsset === undefined) {
            setSourceAsset({
              chainID: chain?.chainID,
              chainName: chain?.chainName,
              ...asset,
            });
          }

          const address = wallet.publicKey?.toBase58();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const walletConnectMetadata = (wallet as any)?._wallet?._UniversalProvider?.session?.peer
            ?.metadata as WalletConnectMetaData;

          setWCDeepLinkByChainType(ChainType.SVM);

          if (svmWallet === undefined) {
            callbacks?.onWalletConnected?.({
              walletName: wallet.name,
              chainId: chain?.chainID,
              address,
            });
            setSvmWallet({
              id: address,
              walletName: wallet.name,
              chainType: ChainType.SVM,
              logo: walletConnectMetadata?.icons[0] ?? wallet.icon,
            });
          }

          return { address, logo: walletConnectMetadata?.icons?.[0] };
        } catch (error) {
          console.error(error);
          throw error;
        }
      };

      const minimalWallet: MinimalWallet = {
        walletName: wallet.name,
        walletPrettyName: wallet.name,
        walletChainType: ChainType.SVM,
        walletInfo: {
          logo: isWalletConnect ? walletConnectLogo : wallet.icon,
        },
        connect: async () => {
          await connectWallet();
        },
        getAddress: async ({ signRequired }) => {
          try {
            if (signRequired) {
              throw new Error("always prompt wallet connection");
            }
            const address = wallet.publicKey;
            if (!address) {
              throw new Error("Address not found");
            }
            return { address: address.toBase58() };
          } catch (error) {
            console.error(error);
            return connectWallet();
          }
        },
        disconnect: async () => {
          await wallet.disconnect();
          setSvmWallet(undefined);
          callbacks?.onWalletDisconnected?.({
            walletName: wallet.name,
            chainType: ChainType.SVM,
          });
        },
        isWalletConnected: wallet.connected,
        isAvailable: wallet.readyState === "Installed" || wallet.readyState === "Loadable",
      };
      wallets.push(minimalWallet);
    }
    return wallets;
  }, [
    solanaWallets,
    chains,
    assets,
    sourceAsset,
    setWCDeepLinkByChainType,
    callbacks,
    setSourceAsset,
    setSvmWallet,
  ]);
  return { createSolanaWallets };
};
