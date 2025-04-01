import { useMemo } from "react";
import { ChainType } from "@skip-go/client";
import { ConnectEco } from "@/components/ConnectEcoRow";
import { usePrimaryChainIdForChainType } from "@/hooks/usePrimaryChainIdForChainType";

type EcosystemConnectorsProps = {
  excludeChainType?: ChainType;
  onClick?: () => void;
};

const ALL_ECOSYSTEMS: ChainType[] = [ChainType.Cosmos, ChainType.EVM, ChainType.SVM];

export const EcosystemConnectors = ({ excludeChainType, onClick }: EcosystemConnectorsProps) => {
  const primarychainIdFOrChainType = usePrimaryChainIdForChainType();

  const ecosystemsToRender = useMemo(() => {
    return ALL_ECOSYSTEMS.filter((eco) => eco !== excludeChainType);
  }, [excludeChainType]);

  return (
    <>
      {ecosystemsToRender.map((ecoType) => (
        <ConnectEco
          key={ecoType}
          chainType={ecoType}
          chainID={primarychainIdFOrChainType[ecoType]}
          onClick={onClick}
        />
      ))}
    </>
  );
};
