import { skipChainsAtom } from "@/state/skipClient";
import {
  chainAddressEffectAtom,
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
import { useGetAccount } from "./useGetAccount";

export const useAutoSetAddress = () => {
  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const requiredChainAddresses = route?.requiredChainAddresses;
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceWallet = useAtomValue(walletsAtom);
  const [isLoading, setIsLoading] = useState(true);

  const [currentSourceWallets, setCurrentSourceWallets] = useState<typeof sourceWallet>();
  const getAccount = useGetAccount();

  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  useAtom(chainAddressEffectAtom);

  const connectedAddress = useAtomValue(connectedAddressesAtom);

  const signRequiredChains = useMemo(() => {
    if (!route?.operations) return;
    const operations = getClientOperations(route.operations);
    const signRequiredChains = operations.filter((o) => o.signRequired).map((o) => o.fromChainID);
    return signRequiredChains;
  }, [route?.operations]);

  const connectRequiredChains = useCallback(
    async (openModal?: boolean) => {
      setIsLoading(true);
      const createWallets = {
        [ChainType.Cosmos]: createCosmosWallets,
        [ChainType.EVM]: createEvmWallets,
        [ChainType.SVM]: createSolanaWallets,
      };

      if (!requiredChainAddresses) return;
      requiredChainAddresses.forEach(async (chainID, index) => {
        const chain = chains?.find((c) => c.chainID === chainID);
        if (!chain) {
          return;
        }
        const showSetAddressModal = () => {
          const isSignRequired = signRequiredChains?.includes(chainID);
          NiceModal.show(Modals.SetAddressModal, {
            signRequired: isSignRequired,
            chainId: chainID,
            chainAddressIndex: index,
          });
        };
        // If already set by manual entry do not auto set
        if (chainAddresses[index].source === WalletSource.Input) return;

        try {
          const chainType = chain.chainType;
          const wallets = createWallets[chainType](chainID);
          const walletName = sourceWallet[chainType]?.walletName;
          const wallet = wallets.find((w) => w.walletName === walletName);
          const isSignRequired = signRequiredChains?.includes(chainID);

          const response = await wallet?.getAddress?.({ signRequired: isSignRequired });

          const isInjectedWallet = connectedAddress?.[chainID];

          const address = connectedAddress?.[chainID] ?? response?.address;

          if (!address) {
            throw new Error(
              "Address not found in connected wallets. \n Opening modal for user to enter address",
            );
          }

          setChainAddresses((prev) => {
            if (
              JSON.stringify(requiredChainAddresses) !==
              JSON.stringify(Object.values(prev).map((chain) => chain.chainID))
            ) {
              return prev;
            }
            return {
              ...prev,
              [index]: {
                chainID,
                address,
                chainType: chainType,
                source: isInjectedWallet ? WalletSource.Injected : WalletSource.Wallet,
                wallet: wallet
                  ? {
                      walletName: wallet?.walletName,
                      walletPrettyName: wallet?.walletPrettyName,
                      walletChainType: chainType,
                      walletInfo: {
                        logo: response?.logo ?? wallet?.walletInfo?.logo,
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
    if (!requiredChainAddresses) return;
    const cosmosWalletChanged = sourceWallet.cosmos?.id !== currentSourceWallets?.cosmos?.id;
    const evmWalletChanged = sourceWallet.evm?.id !== currentSourceWallets?.evm?.id;
    const svmWalletChanged = sourceWallet.svm?.id !== currentSourceWallets?.svm?.id;

    if (cosmosWalletChanged || evmWalletChanged || svmWalletChanged) {
      connectRequiredChains();
      setCurrentSourceWallets(sourceWallet);
    }
  }, [
    connectRequiredChains,
    currentSourceWallets?.cosmos?.id,
    currentSourceWallets?.evm?.id,
    currentSourceWallets?.svm?.id,
    getAccount,
    requiredChainAddresses,
    sourceWallet,
    sourceWallet.cosmos,
  ]);

  return { connectRequiredChains, isLoading };
};
