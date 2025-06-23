import { mainnetChains, testnetChains } from "@/constants/chains";
import { onlyTestnetsAtom } from "@/state/skipClient";
import { walletConnectAtom } from "@/state/wallets";
import { GrazProvider } from "graz";
import { useAtomValue } from "jotai";

type CosmosProviderProps = {
  children: React.ReactNode;
};

export const CosmosProvider: React.FC<CosmosProviderProps> = ({ children }) => {
  const isTestnet = useAtomValue(onlyTestnetsAtom);
  const walletConnect = useAtomValue(walletConnectAtom);
  return (
    <GrazProvider
      grazOptions={{
        chains: isTestnet ? testnetChains : mainnetChains,
        autoReconnect: true,
        walletDefaultOptions: {
          sign: {
            preferNoSetFee: true,
            disableBalanceCheck: true,
          },
        },
        walletConnect: {
          options: {
            projectId: walletConnect.options?.projectId,
            name: walletConnect.options?.name,
          },
          walletConnectModal: walletConnect?.walletConnectModal,
        },
        iframeOptions: {
          allowedIframeParentOrigins: ["https://daodao.zone", "https://dao.daodao.zone"],
        },
      }}
    >
      {children}
    </GrazProvider>
  );
};
