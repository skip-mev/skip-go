import { skipChainsAtom } from "@/state/skipClient";
import {
  userAddressesEffectAtom,
  chainAddressesAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { connectedAddressesAtom } from "@/state/wallets";
import { walletsAtom } from "@/state/wallets";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientOperations } from "@/utils/clientType";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { WalletSource } from "@/modals/SetAddressModal/SetAddressModal";
import { useCreateCosmosWallets } from "./useCreateCosmosWallets";
import { useCreateEvmWallets } from "./useCreateEvmWallets";
import { useCreateSolanaWallets } from "./useCreateSolanaWallets";
import { ChainType } from "@skip-go/client";
import { getCosmosWalletInfo } from "@/constants/graz";
import { WalletType } from "graz";
import { currentTransactionAtom } from "@/state/history";

export const useAutoSetAddress = () => {
  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const requiredChainAddresses = route?.requiredChainAddresses;
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceWallet = useAtomValue(walletsAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [walletHasChanged, setWalletHasChanged] = useState(false);

  const [currentSourceWallets, setCurrentSourceWallets] = useState<typeof sourceWallet>();
  const [currentConnectedAddress, setCurrentConnectedAddress] =
    useState<Record<string, string | undefined>>();

  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  useAtom(userAddressesEffectAtom);

  const connectedAddress = useAtomValue(connectedAddressesAtom);

  const signRequiredChains = useMemo(() => {
    if (!route?.operations) return;
    const operations = getClientOperations(route.operations);
    const signRequiredChains = operations.filter((o) => o.signRequired).map((o) => o.fromChainId);
    return signRequiredChains;
  }, [route?.operations]);

  const connectRequiredChains = useCallback(
    async (openModal?: boolean) => {
      setIsLoading(true);
      const createWallets = {
        [ChainType.Cosmos]: createCosmosWallets,
        [ChainType.Evm]: createEvmWallets,
        [ChainType.Svm]: createSolanaWallets,
      };

      if (!requiredChainAddresses) return;
      requiredChainAddresses.forEach(async (chainId, index) => {
        const chain = chains?.find((c) => c.chainId === chainId);
        if (!chain) return;
        const chainType = chain.chainType;
        const showSetAddressModal = () => {
          const isSignRequired = signRequiredChains?.includes(chainId);
          NiceModal.show(Modals.SetAddressModal, {
            signRequired: isSignRequired,
            chainId: chainId,
            chainAddressIndex: index,
          });
        };

        // If already set by manual entry do not auto set
        if (chainAddresses[index].source === WalletSource.Input) return;

        const isInjectedWallet = connectedAddress?.[chainId];
        if (isInjectedWallet) {
          setChainAddresses((prev) => {
            return {
              ...prev,
              [index]: {
                chainId,
                address: connectedAddress?.[chainId],
                chainType: chainType,
                source: WalletSource.Injected,
                wallet: {
                  walletName: "injected",
                  walletPrettyName: "injected",
                  walletChainType: chainType,
                  walletInfo: {
                    logo: undefined,
                  },
                },
              },
            };
          });
          setIsLoading(false);
          return;
        }

        try {
          const wallets = createWallets[chainType](chainId);
          const walletName = sourceWallet[chainType]?.walletName;
          const wallet = wallets.find((w) => w.walletName === walletName);
          const isSignRequired = signRequiredChains?.includes(chainId);

          const response = await wallet?.getAddress?.({
            signRequired: isSignRequired,
          });

          const isInjectedWallet = connectedAddress?.[chainId];

          const address = connectedAddress?.[chainId] ?? response?.address;
          if (!address) {
            throw new Error(
              "Address not found in connected wallets. \n Opening modal for user to enter address",
            );
          }

          if (
            JSON.stringify(requiredChainAddresses) !==
            JSON.stringify(Object.values(chainAddresses).map((chain) => chain.chainId))
          ) {
            setIsLoading(false);
            return;
          }

          setChainAddresses((prev) => {
            const getLogo = () => {
              if (wallet?.walletChainType === "evm" && wallet?.walletName === "app.keplr") {
                return getCosmosWalletInfo(WalletType.KEPLR).imgSrc;
              }
              return response?.logo ?? wallet?.walletInfo?.logo;
            };

            return {
              ...prev,
              [index]: {
                chainId,
                address,
                chainType: chainType,
                source: isInjectedWallet ? WalletSource.Injected : WalletSource.Wallet,
                wallet: wallet
                  ? {
                      walletName: wallet?.walletName,
                      walletPrettyName: wallet?.walletPrettyName,
                      walletChainType: chainType,
                      walletInfo: {
                        logo: getLogo(),
                      },
                    }
                  : undefined,
              },
            };
          });
        } catch (_error) {
          console.error(_error);
          if (!openModal) return;
          showSetAddressModal();
        } finally {
          setIsLoading(false);
        }
      });
    },
    [
      createCosmosWallets,
      createEvmWallets,
      createSolanaWallets,
      requiredChainAddresses,
      chains,
      chainAddresses,
      signRequiredChains,
      sourceWallet,
      connectedAddress,
      setChainAddresses,
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
    requiredChainAddresses,
    sourceWallet,
  ]);

  useEffect(() => {
    if (walletHasChanged) {
      connectRequiredChains();
      setWalletHasChanged(false);
    }
  }, [connectRequiredChains, walletHasChanged]);

  return { connectRequiredChains, isLoading };
};
