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

    const sourceChain = chains.find((chain) => chain.chainId === route.sourceAssetChainId);
    const destChain = chains.find((chain) => chain.chainId === route.destAssetChainId);

    if (!sourceChain || !destChain) return false;

    const isAxelarTransfer = route.operations.some((op) => OperationType.axelarTransfer in op);

    return (
      sourceChain?.chainType === ChainType.Evm &&
      !isAxelarTransfer &&
      GAS_STATION_CHAIN_IDS.includes(destChain?.chainId)
    );
  }, [chains, route]);

  return isGasStationTx;
};
