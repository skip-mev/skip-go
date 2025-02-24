import { solanaWallets } from "@/constants/solana";
import { cosmosWalletAtom, evmWalletAtom, svmWalletAtom } from "@/state/wallets";
import { useAccount as useCosmosAccount } from "graz";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useAccount as useEvmAccount } from "wagmi";
import { ChainType } from "@skip-go/client";
import { WalletReadyState } from "@solana/wallet-adapter-base";

export const useKeepWalletStateSynced = () => {
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);

  const { data: cosmosAccounts, walletType } = useCosmosAccount({
    multiChain: true,
  });

  const solanaWallet = solanaWallets.find(
    (wallet) => wallet.readyState === WalletReadyState.Installed,
  );

  const evmAccount = useEvmAccount();

  const updateCosmosWallet = useCallback(async () => {
    const currentCosmosId = cosmosAccounts?.["cosmoshub-4"]?.bech32Address;

    if (cosmosAccounts && walletType) {
      setCosmosWallet({
        id: currentCosmosId,
        walletName: walletType,
        chainType: ChainType.Cosmos,
      });
    }
  }, [cosmosAccounts, setCosmosWallet, walletType]);

  const updateEvmWallet = useCallback(async () => {
    const provider = await evmAccount.connector?.getProvider?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walletConnectMetadata = (provider as any)?.session?.peer?.metadata;
    if (evmAccount.connector) {
      setEvmWallet({
        id: evmAccount.address,
        walletName: evmAccount.connector.id,
        chainType: ChainType.EVM,
        logo: walletConnectMetadata?.icons[0] ?? evmAccount.connector?.icon,
      });
    }
  }, [evmAccount.address, evmAccount.connector, setEvmWallet]);

  const updateSvmWallet = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walletConnectMetadata = (solanaWallet as any)?._wallet?._UniversalProvider?.session?.peer
      ?.metadata;

    if (solanaWallet) {
      setSvmWallet({
        id: solanaWallet.publicKey?.toBase58(),
        walletName: solanaWallet.name,
        chainType: ChainType.SVM,
        logo: walletConnectMetadata?.icons[0] ?? solanaWallet.icon,
      });
    }
  }, [setSvmWallet, solanaWallet]);

  useEffect(() => {
    const currentCosmosId = cosmosAccounts?.["cosmoshub-4"]?.bech32Address;
    const currentEvmId = evmAccount.address;
    const currentSolanaId = solanaWallet?.publicKey?.toBase58();

    if (walletType && cosmosWallet?.id !== currentCosmosId) {
      updateCosmosWallet();
    }
    if (solanaWallet && svmWallet?.id !== currentSolanaId) {
      updateSvmWallet();
    }
    if (evmAccount.connector && evmWallet?.id !== currentEvmId) {
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
    cosmosAccounts,
    evmAccount.address,
    updateCosmosWallet,
  ]);
};
