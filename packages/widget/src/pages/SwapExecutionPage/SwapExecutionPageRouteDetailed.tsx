import { styled } from "styled-components";
import { Column, Row } from "@/components/Layout";
import { SwapExecutionPageRouteDetailedRow } from "./SwapExecutionPageRouteDetailedRow";
import { SwapExecutionBridgeIcon } from "@/icons/SwapExecutionBridgeIcon";
import { SwapExecutionSendIcon } from "@/icons/SwapExecutionSendIcon";
import { SwapExecutionSwapIcon } from "@/icons/SwapExecutionSwapIcon";
import { useState } from "react";
import { SmallText } from "@/components/Typography";
import { OperationType } from "@/utils/clientType";
import { skipBridgesAtom, skipSwapVenuesAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { SwapExecutionState } from "./SwapExecutionPage";
import { SwapExecutionPageRouteProps } from "./SwapExecutionPageRouteSimple";
import React from "react";
import { keyframes } from "styled-components";
import { Tooltip } from "@/components/Tooltip";

type operationTypeToIcon = Record<OperationType, JSX.Element>;

const operationTypeToIcon: operationTypeToIcon = {
  // swap icon
  [OperationType.swap]: <SwapExecutionSwapIcon width={34} />,
  [OperationType.evmSwap]: <SwapExecutionSwapIcon width={34} />,
  // bridge icon
  [OperationType.transfer]: <SwapExecutionBridgeIcon width={34} />,
  [OperationType.axelarTransfer]: <SwapExecutionBridgeIcon width={34} />,
  [OperationType.cctpTransfer]: <SwapExecutionBridgeIcon width={34} />,
  [OperationType.hyperlaneTransfer]: <SwapExecutionBridgeIcon width={34} />,
  [OperationType.opInitTransfer]: <SwapExecutionBridgeIcon width={34} />,
  [OperationType.goFastTransfer]: <SwapExecutionBridgeIcon width={34} />,
  [OperationType.stargateTransfer]: <SwapExecutionBridgeIcon width={34} />,
  // send icon
  [OperationType.bankSend]: <SwapExecutionSendIcon width={34} />,
};

const operationTypeToSimpleOperationType = {
  swap: "Swapped",
  evmSwap: "Swapped",
  transfer: "Bridged",
  axelarTransfer: "Bridged",
  cctpTransfer: "Bridged",
  hyperlaneTransfer: "Bridged",
  opInitTransfer: "Bridged",
  bankSend: "Sent",
  goFastTransfer: "Bridged",
  stargateTransfer: "Bridged",
};

type tooltipMap = Record<number, boolean>;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const SwapExecutionPageRouteDetailed = ({
  operations,
  statusData,
  onClickEditDestinationWallet,
  swapExecutionState,
  firstOperationStatus,
}: SwapExecutionPageRouteProps) => {
  const { data: swapVenues } = useAtomValue(skipSwapVenuesAtom);
  const { data: bridges } = useAtomValue(skipBridgesAtom);

  const firstOperation = operations[0];
  const status = statusData?.transferEvents;

  return (
    <StyledSwapExecutionPageRoute>
      <Column>
        <SwapExecutionPageRouteDetailedRow
          tokenAmount={firstOperation.amountIn}
          denom={firstOperation.denomIn}
          chainId={firstOperation.fromChainID}
          explorerLink={status?.[0]?.fromExplorerLink}
          status={firstOperationStatus}
          context="source"
          index={0}
        />
        {operations.map((operation, index) => {
          const simpleOperationType = operationTypeToSimpleOperationType[operation.type];

          const getBridgeSwapVenue = () => {
            const swapVenueId = operation.swapVenues?.[0]?.chainID;
            const bridgeId = operation.bridgeID;

            const bridge = bridges?.find((bridge) => bridge.id === bridgeId);
            const swapVenue = swapVenues?.find((swapVenue) => swapVenue.chainID === swapVenueId);

            const bridgeOrSwapVenue = {
              name: bridge?.name ?? swapVenue?.name,
              image: bridge?.logoURI ?? swapVenue?.logoUri,
            };

            return bridgeOrSwapVenue;
          };

          const bridgeOrSwapVenue = getBridgeSwapVenue();
          const nextOperation = operations[index + 1];

          const asset = {
            tokenAmount: operation.amountOut,
            denom: operation.denomOut,
            chainId: operation.toChainID ?? operation.chainID,
          };

          const explorerLink = operation.isSwap
            ? status?.[operation.transferIndex]?.fromExplorerLink
            : status?.[operation.transferIndex]?.toExplorerLink;
          const opStatus =
            swapExecutionState === SwapExecutionState.confirmed
              ? "completed"
              : status?.[operation.transferIndex]?.status;

          return (
            <React.Fragment key={`row-${operation.fromChain}-${operation.toChainID}-${index}`}>
              <StyledOperationTypeAndTooltipContainer
                style={{ height: "25px", position: "relative" }}
                align="center"
              >
                <Tooltip
                  content={
                    <SmallText normalTextColor textWrap="nowrap">
                      {simpleOperationType} with {bridgeOrSwapVenue.name}
                      <StyledSwapVenueOrBridgeImage
                        width="10"
                        height="10"
                        src={bridgeOrSwapVenue.image}
                      />
                    </SmallText>
                  }
                >
                  <OperationTypeIconContainer justify="center">
                    {operationTypeToIcon[operation.type]}
                  </OperationTypeIconContainer>
                </Tooltip>
              </StyledOperationTypeAndTooltipContainer>
              <SwapExecutionPageRouteDetailedRow
                {...asset}
                index={index}
                onClickEditDestinationWallet={onClickEditDestinationWallet}
                context={index === operations.length - 1 ? "destination" : "intermediary"}
                isSignRequired={nextOperation?.signRequired}
                status={opStatus}
                explorerLink={explorerLink}
              />
            </React.Fragment>
          );
        })}
      </Column>
    </StyledSwapExecutionPageRoute>
  );
};

const OperationTypeIconContainer = styled(Column).attrs({
  as: Column,
})`
  color: ${({ theme }) => theme.primary.text.lowContrast};
  &:hover {
    color: ${({ theme }) => theme.primary.text.normal};
  }
`;

const StyledSwapExecutionPageRoute = styled(Column)`
  padding: 25px;
  gap: 20px;
  background: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;

const StyledSwapVenueOrBridgeImage = styled.img`
  margin-left: 5px;
  object-fit: contain;
  width: 10px;
  height: 10px;
`;

const StyledOperationTypeAndTooltipContainer = styled(Row)`
  position: relative;
  height: 25px;
`;
