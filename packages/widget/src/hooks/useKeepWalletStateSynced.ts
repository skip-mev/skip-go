import { cosmosWalletAtom, evmWalletAtom, svmWalletAtom } from "@/state/wallets";
import { useAccount as useCosmosAccount } from "graz";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useAccount as useEvmAccount } from "wagmi";
import { ChainType } from "@skip-go/client";
import { useWallet } from "@solana/wallet-adapter-react";

export const useKeepWalletStateSynced = () => {
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);

  const { data: cosmosAccounts, walletType } = useCosmosAccount();

  const currentCosmosId = cosmosAccounts
    ? cosmosAccounts[Object.keys(cosmosAccounts)[0]]?.bech32Address
    : "";

  const { wallets: _wallets } = useWallet();
  const solanaWallet = _wallets.map((i) => i.adapter).find((wallet) => wallet.connected === true);

  const evmAccount = useEvmAccount();

  const updateCosmosWallet = useCallback(async () => {
    if (cosmosAccounts && walletType) {
      setCosmosWallet({
        id: currentCosmosId,
        walletName: walletType,
        chainType: ChainType.Cosmos,
      });
    }
  }, [cosmosAccounts, currentCosmosId, setCosmosWallet, walletType]);

  const updateEvmWallet = useCallback(async () => {
    const provider = await evmAccount.connector?.getProvider?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walletConnectMetadata = (provider as any)?.session?.peer?.metadata;
    if (evmAccount.connector) {
      setEvmWallet({
        id: evmAccount.address,
        walletName: evmAccount.connector.id,
        chainType: ChainType.Evm,
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
        chainType: ChainType.Svm,
        logo: walletConnectMetadata?.icons[0] ?? solanaWallet.icon,
      });
    }
  }, [setSvmWallet, solanaWallet]);

  useEffect(() => {
    const currentEvmId = evmAccount.address;
    const currentSolanaId = solanaWallet?.publicKey?.toBase58();

    if (walletType && cosmosWallet?.id !== currentCosmosId) {
      updateCosmosWallet();
    }
    if (solanaWallet?.connected && svmWallet?.id !== currentSolanaId) {
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
    currentCosmosId,
  ]);
};
