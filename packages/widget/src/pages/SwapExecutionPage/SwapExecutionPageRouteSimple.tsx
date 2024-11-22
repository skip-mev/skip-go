
import { styled, useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { useAtomValue } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { chainAddressesAtom } from "@/state/swapExecutionPage";
import { useMemo } from "react";
import { TxsStatus } from "./useBroadcastedTxs";
import { SwapExecutionState } from "./SwapExecutionPage";
import { getClientOperation } from "@/utils/clientType";
import { RouteResponse } from "@skip-go/client";

export type SwapExecutionPageRouteProps = {
  onClickEditDestinationWallet?: () => void;
  statusData?: TxsStatus
  swapExecutionState?: SwapExecutionState;
  route: RouteResponse | undefined;
};

export const SwapExecutionPageRouteSimple = ({
  route,
  statusData,
  onClickEditDestinationWallet: _onClickEditDestinationWallet,
  swapExecutionState
}: SwapExecutionPageRouteProps) => {
  const theme = useTheme();
  const chainAddresses = useAtomValue(chainAddressesAtom);

  if (!route) return null;

  const { operations } = route;

  const firstOp = getClientOperation(operations[0]);
  const lastOp = getClientOperation(operations[operations.length - 1]);

  const status = statusData?.transferEvents;
  const sourceStatus = swapExecutionState === SwapExecutionState.confirmed ? "completed" : status?.[firstOp.transferIndex]?.status;
  const destinationStatus = swapExecutionState === SwapExecutionState.confirmed ? "completed" : status?.[lastOp.transferIndex]?.status;

  const source = {
    denom: route.sourceAssetDenom,
    tokenAmount: route.amountIn,
    chainId: route.sourceAssetChainID,
    usdValue: route?.usdAmountIn,
  };
  const destination = {
    denom: route.destAssetDenom,
    tokenAmount: route.amountOut,
    chainId: route.destAssetChainID,
    usdValue: route.usdAmountOut,
  };

  const isSignRequired = lastOp.signRequired;
  const sourceExplorerLink = status?.[firstOp.transferIndex]?.fromExplorerLink;
  const destinationExplorerLink = status?.[firstOp.transferIndex]?.toExplorerLink;

  const onClickEditDestinationWallet = useMemo(() => {
    if (isSignRequired) return;
    const lastIndex = chainAddresses ? Object.keys(chainAddresses).length - 1 : 0;
    const destinationAddress = chainAddresses?.[lastIndex]?.address;
    if (!destinationAddress || swapExecutionState === SwapExecutionState.pending || swapExecutionState === SwapExecutionState.waitingForSigning || swapExecutionState === SwapExecutionState.validatingGasBalance || swapExecutionState === SwapExecutionState.confirmed) return;
    return _onClickEditDestinationWallet;
  }, [isSignRequired, chainAddresses, swapExecutionState, _onClickEditDestinationWallet]);

  return (
    <StyledSwapExecutionPageRoute justify="space-between">
      <SwapExecutionPageRouteSimpleRow
        {...source}
        status={sourceStatus}
        context="source"
        explorerLink={sourceExplorerLink}
      />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionPageRouteSimpleRow
        {...destination}
        icon={ICONS.pen}
        status={destinationStatus}
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        explorerLink={destinationExplorerLink}
        context="destination"
      />
    </StyledSwapExecutionPageRoute>
  );
};

const StyledBridgeArrowIcon = styled(BridgeArrowIcon)`
  height: 18px;
  width: 54px;
`;

const StyledSwapExecutionPageRoute = styled(Column)`
  padding: 30px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;