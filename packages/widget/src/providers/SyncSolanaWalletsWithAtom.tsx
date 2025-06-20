import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { atom, useSetAtom } from "jotai";
import { useEffect } from "react";

export const SyncSolanaWalletsWithAtom = () => {
  const { wallets: solanaWallets } = useWallet();
  const setSolanaWallets = useSetAtom(solanaWalletsAtom);

  useEffect(() => {
    setSolanaWallets(solanaWallets);
  }, [setSolanaWallets, solanaWallets]);

  return null;
};

export const solanaWalletsAtom = atom<Wallet[]>([]);
