import { mainnetChains, testnetChains } from "@/constants/chains";
import { onlyTestnetsAtom } from "@/state/skipClient";
import { walletConnectAtom } from "@/state/wallets";
import { GrazProvider } from "graz";
import { useAtomValue } from "jotai";

type CosmosProviderProps = {
  children: React.ReactNode;
}

export const CosmosProvider: React.FC<CosmosProviderProps> = ({
  children,
}) => {
  const isTestnet = useAtomValue(onlyTestnetsAtom);
  const walletConnect = useAtomValue(walletConnectAtom);
  return (
    <GrazProvider grazOptions={{
      chains: isTestnet ? testnetChains : mainnetChains,
      autoReconnect: false,
      walletDefaultOptions: {
        sign: {
          preferNoSetFee: true,
        }
      },
      walletConnect: {
        options: {
          projectId: walletConnect.options?.projectId,
          name: walletConnect.options?.name
        },
        walletConnectModal: walletConnect?.walletConnectModal
      }
    }}>
      {children}
    </GrazProvider>
  );
};
