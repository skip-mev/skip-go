import { useAtomValue } from "jotai";
import { evmWalletAtom, svmWalletAtom, cosmosWalletAtom } from "@/state/wallets";

export const useGetWalletStateFromAddress = () => {
  const evmWallet = useAtomValue(evmWalletAtom);
  const svmWallet = useAtomValue(svmWalletAtom);
  const cosmosWallet = useAtomValue(cosmosWalletAtom);

  const getWalletState = (address: string) => {
    if (cosmosWallet?.addressMap) {
      const addressFound = Object.values(cosmosWallet.addressMap).find(
        (key) => address === key?.bech32Address,
      );
      if (addressFound) return cosmosWallet;
    }
    if (evmWallet?.address === address) return evmWallet;
    if (svmWallet?.address === address) return svmWallet;
  };

  return getWalletState;
};
