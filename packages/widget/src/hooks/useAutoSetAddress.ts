import { skipChainsAtom } from "@/state/skipClient";
import { setUserAddressAtom, swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { connectedAddressesAtom, walletsAtom } from "@/state/wallets";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { getClientOperations } from "@/utils/clientType";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { ChainType } from "@skip-go/client";
import { useCreateCosmosWallets } from "./useCreateCosmosWallets";
import { useCreateEvmWallets } from "./useCreateEvmWallets";
import { useCreateSolanaWallets } from "./useCreateSolanaWallets";

export const useAutoSetAddress = () => {
  const { route, userAddresses } = useAtomValue(swapExecutionStateAtom);
  const setUserAddress = useSetAtom(setUserAddressAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const sourceWallet = useAtomValue(walletsAtom);

  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

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
          case ChainType.Cosmos: {
            const wallets = createCosmosWallets(chainID);
            const wallet = wallets.find((w) => w.walletName === sourceWallet.cosmos?.walletName);
            return wallet;
          }
          case ChainType.EVM: {
            const wallets = createEvmWallets(chainID);
            const wallet = wallets.find((w) => w.walletName === sourceWallet.evm?.walletName);
            return wallet;
          }
          case ChainType.SVM: {
            const wallets = createSolanaWallets();
            const wallet = wallets.find((w) => w.walletName === sourceWallet.svm?.walletName);
            return wallet;
          }
          default:
            return undefined;
        }
      };

      try {
        const wallet = getWallet(chainType);
        console.log("auto set address");
        const address =
          connectedAddress?.[chainID] ?? (await wallet?.getAddress?.({ chainId: chainID }));

        if (!address) {
          throw new Error(
            "Address not found in connected wallets. \n Opening modal for user to enter address",
          );
        }

        setUserAddress(
          {
            chainID,
            address: address.toLowerCase(),
          },
          index,
        );
      } catch (_error) {
        console.error(_error);
        showSetAddressModal();
      }
    });
  }, [
    userAddresses,
    chains,
    signRequiredChains,
    createCosmosWallets,
    sourceWallet.cosmos?.walletName,
    sourceWallet.evm?.walletName,
    sourceWallet.svm?.walletName,
    createEvmWallets,
    createSolanaWallets,
    connectedAddress,
    setUserAddress,
  ]);

  return { connectRequiredChains };
};
