import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { skipChainsAtom } from "@/state/skipClient";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { GAS_STATION_CHAIN_IDS, ChainType } from "@skip-go/client";

export const useIsGasStationTx = () => {
  const { route } = useAtomValue(swapExecutionStateAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const isGasStationTx = useMemo(() => {
    if (!chains || !route) return false;

    const destChain = chains.find((chain) => chain.chainID === route.sourceAssetChainID);
    return destChain?.chainType === ChainType.EVM &&
           GAS_STATION_CHAIN_IDS.includes(route.destAssetChainID);
  }, [chains, route]);

  return isGasStationTx;
};
