import { skipChainsAtom } from "@/state/skipClient";
import {
  chainAddressEffectAtom,
  chainAddressesAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { connectedAddressesAtom } from "@/state/wallets";
import { walletsAtom } from "@/state/wallets";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { getClientOperations } from "@/utils/clientType";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { WalletSource } from "@/modals/SetAddressModal/SetAddressModal";
import { useGetAccount } from "./useGetAccount";

export const useAutoSetAddress = () => {
  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const requiredChainAddresses = route?.requiredChainAddresses;
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceWallet = useAtomValue(walletsAtom);
  const getAccount = useGetAccount();

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
        if (chainAddresses[index]?.address) return;

        try {
          const chainType = chain.chainType;
          const account = getAccount(chainID);
          const wallet = account?.wallet;
          const address = connectedAddress?.[chainID] ?? account?.address;
          const isInjectedWallet = connectedAddress?.[chainID];

          if (!address || !wallet) {
            throw new Error(
              "Address not found in connected wallets. \n Opening modal for user to enter address",
            );
          }

          setChainAddresses((prev) => ({
            ...prev,
            [index]: {
              chainID,
              address,
              chainType: chainType,
              source: isInjectedWallet ? WalletSource.Injected : WalletSource.Wallet,
              wallet: {
                walletName: wallet?.name,
                walletPrettyName: wallet?.prettyName,
                walletChainType: chainType,
                walletInfo: {
                  logo: wallet?.logo,
                },
              },
            },
          }));
        } catch (_error) {
          console.error(_error);
          if (!openModal) return;
          showSetAddressModal();
        }
      });
    },
    [
      requiredChainAddresses,
      chains,
      chainAddresses,
      signRequiredChains,
      getAccount,
      connectedAddress,
      setChainAddresses,
    ],
  );

  useQuery({
    queryKey: [
      "auto-set-address",
      {
        requiredChainAddresses,
        chains,
        sourceWallet,
        signRequiredChains,
        chainAddresses,
        connectedAddress,
      },
    ],
    enabled:
      !!requiredChainAddresses &&
      !!chains &&
      (!!sourceWallet.cosmos || !!sourceWallet.evm || !!sourceWallet.svm || !!connectedAddress),
    queryFn: async () => {
      if (!requiredChainAddresses) return;
      await connectRequiredChains();
      return null;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { connectRequiredChains };
};
