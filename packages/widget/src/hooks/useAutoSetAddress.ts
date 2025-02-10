import { skipChainsAtom } from "@/state/skipClient";
import { setUserAddressAtom, swapExecutionStateAtom } from "@/state/swapExecutionPage";
import {
  connectedAddressesAtom,
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
} from "@/state/wallets";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { getClientOperations } from "@/utils/clientType";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { ChainType } from "@skip-go/client";

export const useAutoSetAddress = () => {
  const { route, userAddresses } = useAtomValue(swapExecutionStateAtom);
  const setUserAddress = useSetAtom(setUserAddressAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const evmWallet = useAtomValue(evmWalletAtom);
  const svmWallet = useAtomValue(svmWalletAtom);
  const cosmosWallet = useAtomValue(cosmosWalletAtom);

  const connectedAddress = useAtomValue(connectedAddressesAtom);

  const signRequiredChains = useMemo(() => {
    if (!route?.operations) return;
    const operations = getClientOperations(route.operations);
    const signRequiredChains = operations.filter((o) => o.signRequired).map((o) => o.fromChainID);
    return signRequiredChains;
  }, [route?.operations]);

  const connectRequiredChains = useCallback(async () => {
    userAddresses.forEach(async ({ chainID, address }, index) => {
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
      if (address !== "") return;

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

        if (!address) {
          throw new Error(
            "Address not found in connected wallets. \n Opening modal for user to enter address",
          );
        }

        setUserAddress({
          chainID,
          address: address.toLowerCase(),
        });
      } catch (_error) {
        console.error(_error);
        showSetAddressModal();
      }
    });
  }, [
    userAddresses,
    chains,
    signRequiredChains,
    cosmosWallet,
    evmWallet,
    svmWallet,
    connectedAddress,
    setUserAddress,
  ]);

  return { connectRequiredChains };
};
