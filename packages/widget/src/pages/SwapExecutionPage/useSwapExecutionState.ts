import { useMemo } from "react";
import { ChainAddress } from "@/state/swapExecutionPage";
import { SwapExecutionState } from "./SwapExecutionPage";
import { currentTransactionAtom } from "@/state/history";
import { useAtomValue } from "jotai";
import { gasOnReceiveAtom } from "@/state/gasOnReceive";

type UseSwapExecutionStateParams = {
  chainAddresses: Record<number, ChainAddress>;
  feeRouteChainAddresses?: Record<number, ChainAddress>;
  requiredChainAddresses?: string[];
  feeRouteRequiredChainAddresses?: string[];
  isGettingAddressesLoading: boolean;
  isGettingFeeRouteAddressesLoading?: boolean;
  isFetchingDestinationBalance: boolean;
};

export function useSwapExecutionState({
  chainAddresses,
  requiredChainAddresses,
  isGettingAddressesLoading,
  isFetchingDestinationBalance,
  feeRouteChainAddresses,
  feeRouteRequiredChainAddresses,
  isGettingFeeRouteAddressesLoading,
}: UseSwapExecutionStateParams): SwapExecutionState {
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const isFeeRouteEnabled = useAtomValue(gasOnReceiveAtom);

  const showSignaturesRemaining = useMemo(() => {
    if (!currentTransaction) return false;
    if (
      currentTransaction?.txsRequired >= 2 &&
      currentTransaction?.txsSigned !== currentTransaction?.txsRequired
    ) {
      return true;
    }

    return false;
  }, [currentTransaction]);

  return useMemo(() => {
    if (isFetchingDestinationBalance) return SwapExecutionState.pendingGettingDestinationBalance;
    if (isGettingAddressesLoading) return SwapExecutionState.pendingGettingAddresses;
    if (isFeeRouteEnabled && isGettingFeeRouteAddressesLoading)
      return SwapExecutionState.pendingGettingFeeRouteAddresses;

    if (!chainAddresses) return SwapExecutionState.destinationAddressUnset;
    if (!requiredChainAddresses) return SwapExecutionState.destinationAddressUnset;

    const allAddressesSet = requiredChainAddresses.every(
      (_chainId, index) => chainAddresses[index]?.address,
    );

    const feeRouteAllAddressesSet = feeRouteRequiredChainAddresses?.every(
      (_chainId, index) => feeRouteChainAddresses?.[index]?.address,
    );

    const lastChainAddress = chainAddresses[requiredChainAddresses.length - 1]?.address;

    if (currentTransaction?.status === "completed") {
      return SwapExecutionState.confirmed;
    }

    if (currentTransaction?.status === "pending") {
      return SwapExecutionState.pending;
    }

    if (currentTransaction?.status === "allowance") {
      return SwapExecutionState.approving;
    }

    if (currentTransaction?.status === "validating") {
      return SwapExecutionState.validatingGasBalance;
    }

    if (currentTransaction?.status === "signing") {
      if (showSignaturesRemaining) {
        return SwapExecutionState.signaturesRemaining;
      }
      return SwapExecutionState.waitingForSigning;
    }

    if (!lastChainAddress) {
      return SwapExecutionState.destinationAddressUnset;
    }

    if (!allAddressesSet) {
      return SwapExecutionState.recoveryAddressUnset;
    }

    if (isFeeRouteEnabled && feeRouteRequiredChainAddresses && !feeRouteAllAddressesSet) {
      return SwapExecutionState.feeRouteRecoveryAddressUnset;
    }

    return SwapExecutionState.ready;
  }, [
    isFetchingDestinationBalance,
    isGettingAddressesLoading,
    isFeeRouteEnabled,
    isGettingFeeRouteAddressesLoading,
    chainAddresses,
    requiredChainAddresses,
    feeRouteRequiredChainAddresses,
    currentTransaction?.status,
    feeRouteChainAddresses,
    showSignaturesRemaining,
  ]);
}
