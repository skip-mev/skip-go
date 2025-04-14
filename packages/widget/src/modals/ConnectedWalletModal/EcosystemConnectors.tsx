import { useMemo } from "react";
import { ChainType } from "@skip-go/client";
import { ConnectEcoRow } from "@/modals/ConnectedWalletModal/ConnectEcoRow";

type EcosystemConnectorsProps = {
  excludeChainType?: ChainType;
  connectedWalletModal?: boolean;
  onClick?: (chainType: ChainType) => void;
};

const ALL_ECOSYSTEMS: ChainType[] = [ChainType.Cosmos, ChainType.EVM, ChainType.SVM];

export const EcosystemConnectors = ({
  excludeChainType,
  onClick,
  connectedWalletModal,
}: EcosystemConnectorsProps) => {
  const ecosystemsToRender = useMemo(() => {
    return ALL_ECOSYSTEMS.filter((eco) => eco !== excludeChainType);
  }, [excludeChainType]);

  return (
    <>
      {ecosystemsToRender.map((chainType) => (
        <ConnectEcoRow
          key={chainType}
          chainType={chainType}
          onClick={() => onClick?.(chainType)}
          connectedWalletModal={connectedWalletModal}
        />
      ))}
    </>
  );
};
