import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { ChainType } from "@skip-go/client";
import { onlyTestnetsAtom } from "@/state/skipClient";
import { ConnectEco } from "@/components/ConnectEcoRow";

interface EcosystemConnectorsProps {
  excludeChainType?: ChainType;
}

const ALL_ECOSYSTEMS: ChainType[] = [
  ChainType.Cosmos,
  ChainType.EVM,
  ChainType.SVM,
];

export const EcosystemConnectors = ({ excludeChainType }: EcosystemConnectorsProps) => {
  const onlyTestnets = useAtomValue(onlyTestnetsAtom);

  const representativeChainIDs = useMemo(() => ({
    [ChainType.Cosmos]: onlyTestnets ? "provider" : "cosmoshub-4",
    [ChainType.EVM]: onlyTestnets ? "11155111" : "1",
    [ChainType.SVM]: onlyTestnets ? "solana-devnet" : "solana",
  }), [onlyTestnets]);

  const ecosystemsToRender = useMemo(() => {
    return ALL_ECOSYSTEMS.filter((eco) => eco !== excludeChainType);
  }, [excludeChainType]);

  return (
    <>
      {ecosystemsToRender.map((ecoType) => (
        <ConnectEco
          key={ecoType}
          chainType={ecoType}
          chainID={representativeChainIDs[ecoType]}
        />
      ))}
    </>
  );
};
