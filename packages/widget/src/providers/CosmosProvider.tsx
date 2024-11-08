import { mainnetChains } from "@/constants/chains";
import { GrazProvider } from "graz";


type CosmosProviderProps = {
  children: React.ReactNode;
}

export const CosmosProvider: React.FC<CosmosProviderProps> = ({
  children,
}) => {
  return (
    <GrazProvider grazOptions={{
      // @ts-expect-error mismatch keplr types version
      chains: mainnetChains,
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
