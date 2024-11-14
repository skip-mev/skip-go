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
      // @ts-expect-error mismatch keplr types version
      chains: isTestnet ? testnetChains : mainnetChains,
      autoReconnect: false,
      walletDefaultOptions: {
        sign: {
          preferNoSetFee: true,
        }
      },
      walletConnect: {
        options: {
          projectId: "baea98874b230c2a8d9c0ae32a98677a",
        },
        web3Modal: walletConnect?.web3Modal
      }
    }}>
      {children}
    </GrazProvider>
  );
};
