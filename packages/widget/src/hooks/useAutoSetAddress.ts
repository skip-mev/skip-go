import { skipChainsAtom } from "@/state/skipClient";
import {
  ChainAddress,
  chainAddressEffectAtom,
  chainAddressesAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import {
  connectedAddressesAtom,
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
} from "@/state/wallets";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { getClientOperations } from "@/utils/clientType";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { ChainType } from "@skip-go/client";
import { WalletSource } from "@/modals/SetAddressModal/SetAddressModal";

export const useAutoSetAddress = () => {
  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const requiredChainAddresses = route?.requiredChainAddresses;
  const { data: chains } = useAtomValue(skipChainsAtom);

  const evmWallet = useAtomValue(evmWalletAtom);
  const svmWallet = useAtomValue(svmWalletAtom);
  const cosmosWallet = useAtomValue(cosmosWalletAtom);

  useAtom(chainAddressEffectAtom);

  const connectedAddress = useAtomValue(connectedAddressesAtom);

  const signRequiredChains = useMemo(() => {
    if (!route?.operations) return;
    const operations = getClientOperations(route.operations);
    const signRequiredChains = operations.filter((o) => o.signRequired).map((o) => o.fromChainID);
    return signRequiredChains;
  }, [route?.operations]);

  useEffect(() => {
    const initialChainAddresses: Record<number, ChainAddress> = {};
    if (!route?.requiredChainAddresses) return;

    route?.requiredChainAddresses?.forEach((chainID, index) => {
      initialChainAddresses[index] = {
        chainID,
        address: chainAddresses[index]?.address,
        chainType: chainAddresses[index]?.chainType,
      };
    });
    setChainAddresses(initialChainAddresses);
    //  we only want to run this once to preserve the chainAddresses chainID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectRequiredChains = useCallback(async () => {
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
      const chainType = chain.chainType;
      if (chainAddresses[index]?.address) return;

      const getWallet = (chainType: ChainType) => {
        switch (chainType) {
          case ChainType.Cosmos:
            return cosmosWallet;
          case ChainType.EVM:
            return evmWallet;
          case ChainType.SVM:
            return svmWallet;
          default:
            return undefined;
        }
      };

      try {
        const wallet = getWallet(chainType);
        const address =
          connectedAddress?.[chainID] ??
          (wallet?.addressMap?.[chainID]?.bech32Address as string) ??
          wallet?.address;

        const isInjectedAddress = connectedAddress?.[chainID] !== undefined;

        if (!address) {
          throw new Error(
            "Address not found in connected wallets. \n Opening modal for user to enter address",
          );
        }

        setChainAddresses((prev) => ({
          ...prev,
          [index]: {
            chainID,
            address,
            chainType: wallet?.walletChainType ?? chainType,
            source: isInjectedAddress ? WalletSource.Injected : WalletSource.Wallet,
            wallet: isInjectedAddress
              ? undefined
              : {
                  walletName: wallet?.walletName ?? "",
                  walletPrettyName: wallet?.walletPrettyName ?? "",
                  walletChainType: wallet?.walletChainType ?? chainType,
                  walletInfo: wallet?.walletInfo ?? { logo: "" },
                },
          },
        }));
      } catch (_error) {
        console.error(_error);
        showSetAddressModal();
      }
    });
  }, [
    requiredChainAddresses,
    chains,
    signRequiredChains,
    connectedAddress,
    chainAddresses,
    setChainAddresses,
    cosmosWallet,
    evmWallet,
    svmWallet,
  ]);

  return { connectRequiredChains };
};
