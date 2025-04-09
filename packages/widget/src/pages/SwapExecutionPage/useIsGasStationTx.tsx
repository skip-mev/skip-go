import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { skipChainsAtom } from "@/state/skipClient";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { GAS_STATION_CHAIN_IDS, ChainType } from "@skip-go/client";
import { OperationType } from "@/utils/clientType";

export const useIsGasStationTx = () => {
  const { route } = useAtomValue(swapExecutionStateAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const isGasStationTx = useMemo(() => {
    if (!chains || !route) return false;

    const sourceChain = chains.find((chain) => chain.chainID === route.sourceAssetChainID);
    const destChain = chains.find((chain) => chain.chainID === route.destAssetChainID);

    if (!sourceChain || !destChain) return false;

    const isAxelarTransfer = route.operations.some((op) => OperationType.axelarTransfer in op);

    return sourceChain?.chainType === ChainType.EVM &&
    !isAxelarTransfer && GAS_STATION_CHAIN_IDS.includes(destChain?.chainID);
  }, [chains, route]);

  return isGasStationTx;
};
