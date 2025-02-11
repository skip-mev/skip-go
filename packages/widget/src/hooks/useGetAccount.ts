import { getCosmosWalletInfo } from "@/constants/graz";
import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom } from "@/state/skipClient";
import {
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
  walletsAtom,
  connectedAddressesAtom,
} from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { useAccount as useEvmAccount, useConnectors } from "wagmi";
import { ChainType } from "@skip-go/client";
import { walletConnectLogo } from "@/constants/wagmi";

export const useGetAccount = () => {
  const wallet = useAtomValue(walletsAtom);
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const connectedAddress = useAtomValue(connectedAddressesAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { data: cosmosAccounts, walletType } = useCosmosAccount({
    multiChain: true,
  });

  const solanaWallet = solanaWallets.find((w) => w.name === wallet.svm?.walletName);

  const evmAccount = useEvmAccount();
  const connectors = useConnectors();

  const updateEvmWallet = useCallback(async () => {
    const provider = await evmAccount.connector?.getProvider?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walletConnectMetadata = (provider as any).session?.peer?.metadata;
    if (evmAccount.connector) {
      setEvmWallet({
        walletName: evmAccount.connector.id,
        chainType: ChainType.EVM,
        logo: walletConnectMetadata?.icons[0] ?? evmAccount.connector?.icon,
      });
    }
  }, [evmAccount.connector, setEvmWallet]);

  const updateSvmWallet = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walletConnectMetadata = (solanaWallet as any)?._wallet?._UniversalProvider?.session?.peer
      ?.metadata;

    if (solanaWallet) {
      setSvmWallet({
        walletName: solanaWallet.name,
        chainType: ChainType.SVM,
        logo: walletConnectMetadata?.icons[0] ?? solanaWallet.icon,
      });
    }
  }, [setSvmWallet, solanaWallet]);

  useEffect(() => {
    if (walletType && cosmosWallet === undefined) {
      setCosmosWallet({
        walletName: walletType,
        chainType: ChainType.Cosmos,
      });
    }
    if (solanaWallet && svmWallet === undefined) {
      updateSvmWallet();
    }
    if (evmAccount.connector && evmWallet === undefined) {
      updateEvmWallet();
    }
  }, [
    walletType,
    cosmosWallet,
    solanaWallet,
    svmWallet,
    evmAccount.connector,
    evmWallet,
    setCosmosWallet,
    setSvmWallet,
    setEvmWallet,
    updateEvmWallet,
    updateSvmWallet,
  ]);

  const getAccount = useCallback(
    // if checkChainType is true, it only check wallet connected no chainId is dependent
    (chainId?: string, checkChainType?: boolean) => {
      if (!chainId) return;
      const chainType = chains?.find((c) => c.chainID === chainId)?.chainType;
      if (connectedAddress && connectedAddress[chainId]) {
        return {
          address: connectedAddress[chainId],
          chainType: chainType,
          wallet: {
            name: "injected",
            prettyName: "injected",
          },
        };
      }
      // switch (chainType) {
      //   case ChainType.Cosmos:
      //     if (walletType && cosmosWallet === undefined) {
      //       setCosmosWallet({
      //         walletName: walletType,
      //         chainType: ChainType.Cosmos,
      //       });
      //     }
      //     break;
      //   case ChainType.SVM:
      //     if (solanaWallet && svmWallet === undefined) {
      //       setSvmWallet({
      //         walletName: solanaWallet.name,
      //         chainType: ChainType.SVM,
      //       });
      //     }
      //     break;
      //   case ChainType.EVM:
      //     if (evmAccount.connector && evmWallet === undefined) {
      //       setEvmWallet((prev) => ({
      //         ...prev,
      //         walletName: prev?.walletName ?? evmAccount.connector?.id ?? "",
      //         chainType: ChainType.EVM,
      //       }));
      //     }
      //     break;
      //   default:
      //     break;
      // }

      const getCosmosAccount = () => {
        if (!cosmosAccounts || !chainId) return;
        return cosmosAccounts[chainId];
      };
      const cosmosAccount = getCosmosAccount();

      switch (chainType) {
        case ChainType.Cosmos: {
          if (!cosmosAccount) return;
          if (!wallet.cosmos) return;
          const walletInfo = getCosmosWalletInfo(wallet.cosmos.walletName as WalletType);

          return {
            address: cosmosAccount.bech32Address,
            chainType,
            wallet: {
              name: wallet.cosmos.walletName,
              prettyName: walletInfo.name,
              logo: walletInfo.imgSrc,
              isLedger: cosmosAccount.isNanoLedger,
            },
          };
        }
        case ChainType.EVM: {
          if (!wallet.evm) return;
          if (evmAccount.chainId !== Number(chainId) && !checkChainType) return;
          if (!evmAccount.address) return;
          if (!evmAccount.connector) return;

          const getLogo = () => {
            if (evmAccount?.connector?.id === "walletConnect") {
              return evmWallet?.logo ?? walletConnectLogo;
            }

            if (evmAccount?.connector?.id.includes("keplr")) {
              return getCosmosWalletInfo(WalletType.KEPLR).imgSrc;
            }
            return connectors.find((item) => item.id === evmAccount.connector?.id)?.icon;
          };
          return {
            address: evmAccount.address as string,
            currentConnectedEVMChainId: String(evmAccount.chainId),
            chainType,
            wallet: {
              name: evmAccount.connector.id,
              prettyName: evmAccount.connector.name,
              logo: getLogo(),
            },
          };
        }
        case ChainType.SVM: {
          if (!wallet.svm) return;
          if (!solanaWallet?.publicKey) return;
          return {
            address: solanaWallet.publicKey.toBase58(),
            chainType,
            wallet: {
              name: solanaWallet.name as string,
              prettyName: solanaWallet.name as string,
              logo: solanaWallet.name === "WalletConnect" ? walletConnectLogo : solanaWallet.icon,
            },
          };
        }
        default:
          return undefined;
      }
    },
    [
      chains,
      solanaWallet,
      evmAccount.connector,
      evmAccount.chainId,
      evmAccount.address,
      evmWallet,
      cosmosAccounts,
      wallet.evm,
      wallet.cosmos,
      wallet.svm,
      connectors,
      connectedAddress,
    ],
  );

  return getAccount;
};
