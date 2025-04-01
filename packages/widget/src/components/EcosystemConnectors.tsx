import { useMemo } from "react";
import { ChainType } from "@skip-go/client";
import { ConnectEco } from "@/components/ConnectEcoRow";
import { usePrimaryChainIdForChainType } from "@/hooks/usePrimaryChainIdForChainType";

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
  const primarychainIdFOrChainType = usePrimaryChainIdForChainType();

  const ecosystemsToRender = useMemo(() => {
    return ALL_ECOSYSTEMS.filter((eco) => eco !== excludeChainType);
  }, [excludeChainType]);

  return (
    <>
      {ecosystemsToRender.map((chainType) => (
        <ConnectEco
          key={chainType}
          chainType={chainType}
          chainID={primarychainIdFOrChainType[chainType]}
          onClick={() => onClick?.(chainType)}
          connectedWalletModal={connectedWalletModal}
        />
      ))}
    </>
  );
};
