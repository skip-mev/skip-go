import {
  ChainAddress,
  feeRouteChainAddressesAtom,
  feeRouteUserAddressesEffectAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { connectedAddressesAtom, walletsAtom } from "@/state/wallets";
import { ChainType } from "@skip-go/client";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { useCreateCosmosWallets } from "./useCreateCosmosWallets";
import { useCreateEvmWallets } from "./useCreateEvmWallets";
import { useCreateSolanaWallets } from "./useCreateSolanaWallets";
import { WalletSource } from "@/modals/SetAddressModal/SetAddressModal";
import { getCosmosWalletInfo } from "@/constants/graz";
import { WalletType } from "graz";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { currentTransactionAtom } from "@/state/history";

export const useFeeRouteAutoSetAddress = () => {
  const [feeRouteChainAddresses, setFeeRouteChainAddresses] = useAtom(feeRouteChainAddressesAtom);
  const { feeRoute, isFeeRouteEnabled } = useAtomValue(swapExecutionStateAtom);
  const [isLoading, setIsLoading] = useState(true);
  const connectedAddress = useAtomValue(connectedAddressesAtom);
  const sourceWallet = useAtomValue(walletsAtom);

  const currentTransaction = useAtomValue(currentTransactionAtom);
  const [walletHasChanged, setWalletHasChanged] = useState(false);

  const [currentSourceWallets, setCurrentSourceWallets] = useState<typeof sourceWallet>();
  const [currentConnectedAddress, setCurrentConnectedAddress] =
    useState<Record<string, string | undefined>>();

  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  useAtom(feeRouteUserAddressesEffectAtom);

  const connectRequiredChains = useCallback(
    async (openModal?: boolean) => {
      setIsLoading(true);
      const createWallets = {
        [ChainType.Cosmos]: createCosmosWallets,
        [ChainType.Evm]: createEvmWallets,
        [ChainType.Svm]: createSolanaWallets,
      };
      try {
        if (!feeRoute || !isFeeRouteEnabled) return;
        const requiredChainAddresses = feeRoute.requiredChainAddresses;
        if (!requiredChainAddresses) return;
        Object.entries(feeRouteChainAddresses).forEach(async ([_index, chainAddress], index) => {
          if (!chainAddress.address || chainAddress.address === "") {
            const injectedAddress = connectedAddress?.[chainAddress.chainId];
            if (injectedAddress) {
              setFeeRouteChainAddresses((prev) => ({
                ...prev,
                [index]: {
                  ...chainAddress,
                  address: injectedAddress,
                  source: WalletSource.Injected,
                },
              }));
            } else {
              if (!chainAddress.chainType) return;
              const wallets = createWallets[chainAddress.chainType](chainAddress.chainId);
              const walletName = sourceWallet[chainAddress.chainType]?.walletName;
              const wallet = wallets.find((w) => w.walletName === walletName);
              const response = await wallet?.getAddress?.({});
              const getLogo = () => {
                if (wallet?.walletChainType === "evm" && wallet?.walletName === "app.keplr") {
                  return getCosmosWalletInfo(WalletType.KEPLR).imgSrc;
                }
                return response?.logo ?? wallet?.walletInfo?.logo;
              };
              if (response?.address) {
                setFeeRouteChainAddresses((prev) => ({
                  ...prev,
                  [index]: {
                    ...chainAddress,
                    address: response.address,
                    logo: response.logo,
                    source: WalletSource.Wallet,
                    wallet: wallet
                      ? {
                          walletName: wallet?.walletName,
                          walletPrettyName: wallet?.walletPrettyName,
                          walletChainType: chainAddress.chainType,
                          walletInfo: {
                            logo: getLogo(),
                          },
                        }
                      : undefined,
                  } as ChainAddress,
                }));
              } else if (openModal) {
                NiceModal.show(Modals.SetAddressModal, {
                  chainId: chainAddress.chainId,
                  chainAddressIndex: index,
                  isFeeRoute: true,
                });
              }
            }
          }
        });
      } catch (error) {
        console.error("Error connecting required chains:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      connectedAddress,
      createCosmosWallets,
      createEvmWallets,
      createSolanaWallets,
      feeRoute,
      feeRouteChainAddresses,
      isFeeRouteEnabled,
      setFeeRouteChainAddresses,
      sourceWallet,
    ],
  );

  useEffect(() => {
    if (currentTransaction && currentTransaction?.status !== "unconfirmed") {
      setIsLoading(false);
      return;
    }

    const hasWalletChanged =
      sourceWallet.cosmos?.id !== currentSourceWallets?.cosmos?.id ||
      sourceWallet.evm?.id !== currentSourceWallets?.evm?.id ||
      sourceWallet.svm?.id !== currentSourceWallets?.svm?.id;

    const hasConnectedAddressChanged =
      JSON.stringify(connectedAddress) !== JSON.stringify(currentConnectedAddress);

    if (hasConnectedAddressChanged) {
      setCurrentConnectedAddress(connectedAddress);
      setWalletHasChanged(true);
    }

    if (hasWalletChanged) {
      setCurrentSourceWallets(sourceWallet);
      setWalletHasChanged(true);
    }
  }, [
    connectRequiredChains,
    connectedAddress,
    currentConnectedAddress,
    currentSourceWallets?.cosmos?.id,
    currentSourceWallets?.evm?.id,
    currentSourceWallets?.svm?.id,
    currentTransaction,
    currentTransaction?.status,
    isLoading,
    feeRoute?.requiredChainAddresses,
    sourceWallet,
  ]);

  useEffect(() => {
    if (!isFeeRouteEnabled) {
      setIsLoading(false);
      return;
    } else {
      setWalletHasChanged(true);
    }
  }, [isFeeRouteEnabled]);

  useEffect(() => {
    if (walletHasChanged && isFeeRouteEnabled) {
      connectRequiredChains();
      setWalletHasChanged(false);
    }
  }, [
    connectRequiredChains,
    isFeeRouteEnabled,
    feeRoute?.requiredChainAddresses,
    walletHasChanged,
  ]);

  return {
    connectRequiredChains,
    isLoading,
  };
};
