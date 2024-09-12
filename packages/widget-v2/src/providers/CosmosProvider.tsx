import { mainnetChains } from "@/constants/graz";
import { GrazProvider } from "graz";


type CosmosProviderProps = {
  children: React.ReactNode;
}

export const CosmosProvider: React.FC<CosmosProviderProps> = ({
  children,
}) => {
  return (
    <GrazProvider grazOptions={{
      chains: mainnetChains,
      autoReconnect: true,
      walletDefaultOptions: {
        sign: {
          preferNoSetFee: true,
        }
      },
      onNotFound: () => {
        console.warn("wallet not found");
      },
    }}>
      {children}
    </GrazProvider>
  );
};
