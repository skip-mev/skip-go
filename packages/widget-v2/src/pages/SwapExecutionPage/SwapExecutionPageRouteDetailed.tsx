import styled from "styled-components";
import { Column, Row } from "@/components/Layout";
import {
  SwapExecutionPageRouteDetailedRow,
  txState,
} from "./SwapExecutionPageRouteDetailedRow";
import { SwapExecutionBridgeIcon } from "@/icons/SwapExecutionBridgeIcon";
import { SwapExecutionSendIcon } from "@/icons/SwapExecutionSendIcon";
import { SwapExecutionSwapIcon } from "@/icons/SwapExecutionSwapIcon";
import { useState } from "react";
import { SmallText } from "@/components/Typography";
import { ClientOperation, OperationType } from "@/utils/clientType";
import { skipBridgesAtom, skipSwapVenuesAtom } from "@/state/skipClient";
import { useAtom } from "jotai";
import { getIsOperationSignRequired } from "@/utils/operations";

export type SwapExecutionPageRouteDetailedProps = {
  operations: ClientOperation[];
  txStateMap: Record<number, txState>;
};

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
};

type tooltipMap = Record<number, boolean>;

export const SwapExecutionPageRouteDetailed = ({
  operations,
  txStateMap,
}: SwapExecutionPageRouteDetailedProps) => {
  const [{ data: swapVenues }] = useAtom(skipSwapVenuesAtom);
  const [{ data: bridges }] = useAtom(skipBridgesAtom);
  const [tooltipMap, setTooltipMap] = useState<tooltipMap>({});

  const handleMouseEnterOperationType = (index: number) => {
    setTooltipMap((old) => ({
      ...old,
      [index]: true,
    }));
  };

  const handleMouseLeaveOperationType = (index: number) => {
    setTooltipMap((old) => ({
      ...old,
      [index]: false,
    }));
  };

  const firstOperation = operations[0];

  return (
    <StyledSwapExecutionPageRoute justify="space-between">
      <SwapExecutionPageRouteDetailedRow
        tokenAmount={firstOperation.amountIn}
        denom={firstOperation.denomIn}
        chainID={firstOperation.fromChainID}
        txState={"pending"}
        key={`first-row-${firstOperation?.denomIn}`}
        context="source"
        index={0}
      />
      {operations.map((operation, index) => {
        const simpleOperationType =
          operationTypeToSimpleOperationType[operation.type];

        const getBridgeSwapVenue = () => {
          const swapVenueId = operation.swapVenues?.[0]?.chainID;
          const bridgeId = operation.bridgeID;

          const bridge = bridges?.find(bridge => bridge.id === bridgeId);
          const swapVenue = swapVenues?.find(swapVenue => swapVenue.chainID === swapVenueId);

          const bridgeOrSwapVenue = {
            name: bridge?.name ?? swapVenue?.name,
            image: bridge?.logoURI ?? swapVenue?.logoUri,
          };

          return bridgeOrSwapVenue;
        };

        const bridgeOrSwapVenue = getBridgeSwapVenue();
        const nextOperation = operations[index + 1];
        const isSignRequired = getIsOperationSignRequired(index, operations, nextOperation, operation);

        const asset = {
          tokenAmount: operation.amountOut,
          denom: operation.denomOut,
          chainID: operation.toChainID ?? operation.chainID,
        };

        return (
          <>
            <Row key={`tooltip-${asset?.denom}-${index}`} style={{ height: "25px" }} align="center">
              <OperationTypeIconContainer
                onMouseEnter={() => handleMouseEnterOperationType(index)}
                onMouseLeave={() => handleMouseLeaveOperationType(index)}
                justify="center"
                key={`operation-${asset?.denom}-${index}`}
              >
                {operationTypeToIcon[operation.type]}
              </OperationTypeIconContainer>
              {tooltipMap?.[index] && (
                <Tooltip>
                  {simpleOperationType} with {bridgeOrSwapVenue.name}
                  <StyledSwapVenueOrBridgeImage width="10" height="10" src={bridgeOrSwapVenue.image} />
                </Tooltip>
              )}
            </Row>
            <SwapExecutionPageRouteDetailedRow
              {...asset}
              index={index}
              context={index === operations.length - 1 ? "destination" : "intermediary"}
              isSignRequired={isSignRequired}
              txState={txStateMap[index]}
              explorerLink={
                txStateMap[index] !== "pending"
                  ? "https://www.google.com/"
                  : undefined
              }
              key={`row-${asset?.denom}-${index}`}
            />
          </>
        );
      })}
    </StyledSwapExecutionPageRoute>
  );
};

const Tooltip = styled(SmallText).attrs({
  normalTextColor: true,
})`
  padding: 10px;
  border-radius: 13px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background-color: ${({ theme }) => theme.secondary.background.normal};
  box-sizing: border-box;
`;

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
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;

const StyledSwapVenueOrBridgeImage = styled.img`
  margin-left: 5px;
  object-fit: contain;
  width: 10px;
  height: 10px;
`;
