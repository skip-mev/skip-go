import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { skipChainsAtom } from "@/state/skipClient";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { GAS_STATION_CHAIN_IDS, ChainType } from "@skip-go/client";
import { ClientOperation, OperationType } from "@/utils/clientType";
import { useGetBalance } from "@/hooks/useGetBalance";

export const useIsGasStationTx = () => {
  const { route } = useAtomValue(swapExecutionStateAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);
  const getBalance = useGetBalance();

  const isGasStationTx = useMemo(() => {
    if (!chains || !route) return false;

    const sourceChain = chains.find((chain) => chain.chainID === route.sourceAssetChainID);
    const destChain = chains.find((chain) => chain.chainID === route.destAssetChainID);

    const destChainFeeBalance = getBalance(destChain.chainID, destChain?.feeAssets[0]?.denom?.amount);
    const hasGasFeeBalance = Number(destChainFeeBalance) > 0;
    const isAxelarTransfer = route.operations.some((op: ClientOperation) => OperationType.axelarTransfer in op);

    return sourceChain?.chainType === ChainType.EVM && !hasGasFeeBalance &&
    !isAxelarTransfer && GAS_STATION_CHAIN_IDS.includes(destChain?.chainID);
  }, [chains, route]);

  return isGasStationTx;
};
