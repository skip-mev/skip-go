export enum SwapExecutionState {
  recoveryAddressUnset,
  destinationAddressUnset,
  ready,
  pending,
  waitingForSigning,
  signaturesRemaining,
  confirmed,
  validatingGasBalance,
  approving,
  pendingGettingAddresses,
}

import { RouteResponse } from "@skip-go/client";
import { SimpleStatus } from "./clientType";
import { ChainAddress } from "@/state/swapExecutionPage";

export type ComputeSwapExecutionStateParams = {
  chainAddresses: Record<number, ChainAddress>;
  route?: RouteResponse;
  overallStatus: SimpleStatus;
  isValidatingGasBalance?: { status: string };
  signaturesRemaining: number;
  isLoading: boolean;
};

export function computeSwapExecutionState({
  chainAddresses,
  route,
  overallStatus,
  isValidatingGasBalance,
  signaturesRemaining,
  isLoading,
}: ComputeSwapExecutionStateParams): SwapExecutionState {
  if (isLoading) return SwapExecutionState.pendingGettingAddresses;
  if (!chainAddresses) return SwapExecutionState.destinationAddressUnset;
  const requiredChainAddresses = route?.requiredChainAddresses;
  if (!requiredChainAddresses) return SwapExecutionState.destinationAddressUnset;

  const allAddressesSet = requiredChainAddresses.every(
    (_chainId, index) => chainAddresses[index]?.address,
  );

  const lastChainAddress = chainAddresses[requiredChainAddresses.length - 1]?.address;

  if (overallStatus === "completed") {
    return SwapExecutionState.confirmed;
  }

  if (overallStatus === "pending") {
    if (signaturesRemaining > 0) {
      return SwapExecutionState.signaturesRemaining;
    }
    return SwapExecutionState.pending;
  }

  if (overallStatus === "approving") {
    return SwapExecutionState.approving;
  }

  if (isValidatingGasBalance && isValidatingGasBalance.status !== "completed") {
    return SwapExecutionState.validatingGasBalance;
  }

  if (overallStatus === "signing") {
    return SwapExecutionState.waitingForSigning;
  }

  if (!lastChainAddress) {
    return SwapExecutionState.destinationAddressUnset;
  }

  if (!allAddressesSet) {
    return SwapExecutionState.recoveryAddressUnset;
  }

  return SwapExecutionState.ready;
}
