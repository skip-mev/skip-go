import { skipChainsAtom } from "@/state/skipClient";
import {
  ChainAddress,
  chainAddressEffectAtom,
  chainAddressesAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { connectedAddressesAtom } from "@/state/wallets";
import { walletsAtom } from "@/state/wallets";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useCreateCosmosWallets } from "./useCreateCosmosWallets";
import { useCreateEvmWallets } from "./useCreateEvmWallets";
import { useCreateSolanaWallets } from "./useCreateSolanaWallets";
import { useCallback, useEffect, useMemo } from "react";
import { getClientOperations } from "@/utils/clientType";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { ChainType } from "@skip-go/client";
import { WalletSource } from "@/modals/SetAddressModal/SetAddressModal";
import { isMobile } from "@/utils/os";

export const useAutoSetAddress = () => {
  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const requiredChainAddresses = route?.requiredChainAddresses;
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceWallet = useAtomValue(walletsAtom);

  useAtom(chainAddressEffectAtom);

  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  const connectedAddress = useAtomValue(connectedAddressesAtom);

  const mobile = isMobile();

  const signRequiredChains = useMemo(() => {
    if (!route?.operations) return;
    const operations = getClientOperations(route.operations);
    const signRequiredChains = operations.filter((o) => o.signRequired).map((o) => o.fromChainID);
    return signRequiredChains;
  }, [route?.operations]);

  useEffect(() => {
    const res: Record<number, ChainAddress> = {};
    if (!route?.operations) return;
    route?.requiredChainAddresses?.forEach((chainID, index) => {
      res[index] = {
        chainID,
        address: chainAddresses[index]?.address,
        chainType: chainAddresses[index]?.chainType,
      };
    });
    setChainAddresses(res);
    //  we only want to run this once to preserve the chainAddresses chainID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectRequiredChains = useCallback(
    async (openModal?: boolean) => {
      if (!requiredChainAddresses) return;
      requiredChainAddresses.forEach(async (chainID, index) => {
        const chain = chains?.find((c) => c.chainID === chainID);
        if (!chain) {
          return;
        }
        const isSignRequired = signRequiredChains?.includes(chainID);
        if (connectedAddress?.[chainID]) {
          setChainAddresses((prev) => ({
            ...prev,
            [index]: {
              chainID,
              address: connectedAddress[chainID],
              chainType: chains?.find((c) => c.chainID === chainID)?.chainType,
              source: WalletSource.Injected,
            },
          }));
          return;
        }
        const chainType = chain.chainType;
        // If already set by manual entry do not auto set
        if (chainAddresses[index]?.address) return;
        switch (chainType) {
          case ChainType.Cosmos: {
            try {
              const wallets = createCosmosWallets(chainID);
              const wallet = wallets.find((w) => w.walletName === sourceWallet.cosmos?.walletName);
              if (!wallet) {
                if (!openModal) return;
                NiceModal.show(Modals.SetAddressModal, {
                  signRequired: isSignRequired,
                  chainId: chainID,
                  chainAddressIndex: index,
                });
                return;
              }
              const address = await wallet?.getAddress?.({
                signRequired: isSignRequired,
              });
              if (!address) {
                return;
              }
              setChainAddresses((prev) => ({
                ...prev,
                [index]: {
                  chainID,
                  address,
                  chainType: ChainType.Cosmos,
                  source: WalletSource.Wallet,
                  wallet: {
                    walletName: wallet?.walletName,
                    walletPrettyName: wallet?.walletPrettyName,
                    walletChainType: wallet?.walletChainType,
                    walletInfo: wallet?.walletInfo,
                  },
                },
              }));
            } catch (_) {
              if (!openModal) return;
              NiceModal.show(Modals.SetAddressModal, {
                signRequired: isSignRequired,
                chainId: chainID,
                chainAddressIndex: index,
              });
            }
            break;
          }
          case ChainType.SVM: {
            try {
              const wallets = createSolanaWallets();
              const wallet = wallets.find((w) => w.walletName === sourceWallet.svm?.walletName);
              if (!wallet) {
                if (!openModal) return;
                NiceModal.show(Modals.SetAddressModal, {
                  signRequired: isSignRequired,
                  chainId: chainID,
                });
                return;
              }
              const address = await wallet?.getAddress?.({
                signRequired: isSignRequired,
              });
              if (!address) {
                return;
              }
              setChainAddresses((prev) => ({
                ...prev,
                [index]: {
                  chainID,
                  address,
                  chainType: ChainType.SVM,
                  source: WalletSource.Wallet,
                  wallet: {
                    walletName: wallet?.walletName,
                    walletPrettyName: wallet?.walletPrettyName,
                    walletChainType: wallet?.walletChainType,
                    walletInfo: wallet?.walletInfo,
                  },
                },
              }));
            } catch (_) {
              if (!openModal) return;
              NiceModal.show(Modals.SetAddressModal, {
                signRequired: isSignRequired,
                chainId: chainID,
                chainAddressIndex: index,
              });
            }

            break;
          }
          case ChainType.EVM: {
            try {
              const wallets = createEvmWallets(chainID);
              const wallet = wallets.find((w) => w.walletName === sourceWallet.evm?.walletName);
              if (wallet?.walletName === "walletConnect" && mobile) {
                return;
              }
              if (!wallet) {
                if (!openModal) return;
                NiceModal.show(Modals.SetAddressModal, {
                  signRequired: isSignRequired,
                  chainId: chainID,
                });
                return;
              }
              const address = await wallet?.getAddress?.({
                signRequired: isSignRequired,
              });
              if (!address) {
                return;
              }
              setChainAddresses((prev) => ({
                ...prev,
                [index]: {
                  chainID,
                  address,
                  chainType: ChainType.EVM,
                  source: WalletSource.Wallet,
                  wallet: {
                    walletName: wallet?.walletName,
                    walletPrettyName: wallet?.walletPrettyName,
                    walletChainType: wallet?.walletChainType,
                    walletInfo: wallet?.walletInfo,
                  },
                },
              }));
            } catch (_) {
              if (!openModal) return;
              NiceModal.show(Modals.SetAddressModal, {
                signRequired: isSignRequired,
                chainId: chainID,
                chainAddressIndex: index,
              });
            }
            break;
          }
          default:
            break;
        }
      });
    },
    [
      requiredChainAddresses,
      chains,
      signRequiredChains,
      connectedAddress,
      chainAddresses,
      setChainAddresses,
      createCosmosWallets,
      sourceWallet.cosmos?.walletName,
      sourceWallet.svm?.walletName,
      sourceWallet.evm?.walletName,
      createSolanaWallets,
      createEvmWallets,
      mobile,
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
