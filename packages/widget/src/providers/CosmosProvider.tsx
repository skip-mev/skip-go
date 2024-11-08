import { mainnetChains, testnetChains } from "@/constants/chains";
import { onlyTestnetsAtom } from "@/state/skipClient";
import { GrazProvider } from "graz";
import { useAtomValue } from "jotai";

type CosmosProviderProps = {
  children: React.ReactNode;
}

export const CosmosProvider: React.FC<CosmosProviderProps> = ({
  children,
}) => {
  const isTestnet = useAtomValue(onlyTestnetsAtom)
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
    }}>
      {children}
    </GrazProvider>
  );
};
