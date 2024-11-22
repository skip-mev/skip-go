// SwapExecutionPageRoute.jsx

import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useTheme } from 'styled-components'; // Adjust if using a different theming solution
import {
  chainAddressesAtom,
  skipSwapVenuesAtom,
  skipBridgesAtom,
} from './atoms'; // Update with your actual atom imports
import { SwapExecutionPageRouteSimpleRow } from './SwapExecutionPageRouteSimpleRow';
import { SwapExecutionPageRouteDetailedRow } from './SwapExecutionPageRouteDetailedRow';
import { SwapExecutionState } from './constants'; // Update with your actual constants
import ICONS from './icons'; // Update with your actual icons import
import { Column } from './components'; // Update with your actual component imports
import {
  StyledSwapExecutionPageRoute,
  StyledBridgeArrowIcon,
} from './StyledComponents'; // Update with your actual styled components

export const SwapExecutionPageRoute = ({
  route,
  statusData,
  onClickEditDestinationWallet,
  swapExecutionState,
  simpleView,
}) => {
  const theme = useTheme();
  const chainAddresses = useAtomValue(chainAddressesAtom);

  const status = statusData?.transferEvents;
  const isSignRequired = route?.txsRequired > 1;

  const source = {
    denom: route.sourceAssetDenom,
    tokenAmount: route.amountIn,
    chainId: route.sourceAssetChainID,
    usdValue: route.usdAmountIn,
    explorerLink: status?.[0]?.fromExplorerLink,
    status:
      swapExecutionState === SwapExecutionState.confirmed
        ? "completed"
        : status?.[0]?.status,
  };

  const destinationIndex = (route?.txsRequired ?? 1) - 1;
  const destination = {
    denom: route.destAssetDenom,
    tokenAmount: route.amountOut,
    chainId: route.destAssetChainID,
    usdValue: route.usdAmountOut,
    explorerLink: status?.[destinationIndex]?.toExplorerLink,
    status:
      swapExecutionState === SwapExecutionState.confirmed
        ? "completed"
        : status?.[destinationIndex]?.status,
  };

  const handleEditDestinationWallet = useMemo(() => {
    if (isSignRequired) return;
    const lastIndex = chainAddresses
      ? Object.keys(chainAddresses).length - 1
      : 0;
    const destinationAddress = chainAddresses?.[lastIndex]?.address;
    if (
      !destinationAddress ||
      [
        SwapExecutionState.pending,
        SwapExecutionState.waitingForSigning,
        SwapExecutionState.validatingGasBalance,
        SwapExecutionState.confirmed,
      ].includes(swapExecutionState)
    )
      return;
    return onClickEditDestinationWallet;
  }, [
    isSignRequired,
    chainAddresses,
    swapExecutionState,
    onClickEditDestinationWallet,
  ]);

  if (simpleView) {
    return (
      <StyledSwapExecutionPageRoute justify="space-between">
        <SwapExecutionPageRouteSimpleRow
          {...source}
          context="source"
        />
        <StyledBridgeArrowIcon color={theme.primary.text.normal} />
        <SwapExecutionPageRouteSimpleRow
          {...destination}
          context="destination"
          onClickEditDestinationWallet={handleEditDestinationWallet}
        />
      </StyledSwapExecutionPageRoute>
    );
  } else {
    // Construct steps for detailed view
    const steps = useMemo(() => {
      const stepsArray = [];
      const chainIds = route.chainIDs;
      const numSteps = chainIds.length;

      for (let i = 0; i < numSteps; i++) {
        const chainId = chainIds[i];
        const isSource = i === 0;
        const isDestination = i === numSteps - 1;
        const context = isSource
          ? "source"
          : isDestination
            ? "destination"
            : "intermediary";

        const tokenAmount = isSource
          ? route.amountIn
          : isDestination
            ? route.amountOut
            : null; // Intermediary amounts might not be available
        const denom = isSource
          ? route.sourceAssetDenom
          : isDestination
            ? route.destAssetDenom
            : null; // Intermediary denoms might not be available

        const explorerLink =
          status?.[i]?.fromExplorerLink || status?.[i]?.toExplorerLink;
        const stepStatus =
          swapExecutionState === SwapExecutionState.confirmed
            ? "completed"
            : status?.[i]?.status;

        stepsArray.push({
          chainId,
          context,
          tokenAmount,
          denom,
          explorerLink,
          status: stepStatus,
          index: i,
        });
      }

      return stepsArray;
    }, [route, status, swapExecutionState]);

    return (
      <StyledSwapExecutionPageRoute>
        <Column>
          {steps.map((step) => (
            <SwapExecutionPageRouteDetailedRow
              key={`row-${step.chainId}-${step.index}`}
              tokenAmount={step.tokenAmount}
              denom={step.denom}
              chainId={step.chainId}
              explorerLink={step.explorerLink}
              status={step.status}
              context={step.context}
              index={step.index}
              onClickEditDestinationWallet={
                step.context === "destination"
                  ? handleEditDestinationWallet
                  : undefined
              }
            />
          ))}
        </Column>
      </StyledSwapExecutionPageRoute>
    );
  }
};
