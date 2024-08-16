import styled from 'styled-components';
import { Column, Row } from '../../components/Layout';
import {
  Operation,
  SwapExecutionFlowRouteDetailedRow,
  txState,
} from './SwapExecutionFlowRouteDetailedRow';
import { SwapExecutionBridgeIcon } from '../../icons/SwapExecutionBridgeIcon';
import { SwapExecutionSendIcon } from '../../icons/SwapExecutionSendIcon';
import { SwapExecutionSwapIcon } from '../../icons/SwapExecutionSwapIcon';
import { useEffect, useState } from 'react';
import { SmallText } from '../../components/Typography';

export type SwapExecutionFlowRouteDetailedProps = {
  operations: Operation[];
};

type operationTypeToIcon = {
  [index: string]: JSX.Element;
};

const operationTypeToIcon: operationTypeToIcon = {
  axelarTransfer: <SwapExecutionBridgeIcon width={34} />,
  swap: <SwapExecutionSwapIcon width={34} />,
  transfer: <SwapExecutionSendIcon width={34} />,
};

const operationTypeToSimpleOperationType = {
  swap: 'Swapped',
  evmSwap: 'Swapped',
  transfer: 'Bridged',
  axelarTransfer: 'Bridged',
  cctpTransfer: 'Bridged',
  hyperlaneTransfer: 'Bridged',
  opInitTransfer: 'Bridged',
  bankSend: 'Sent',
};

type tooltipMap = {
  [index: number]: boolean;
};

export const SwapExecutionFlowRouteDetailed = ({
  operations,
}: SwapExecutionFlowRouteDetailedProps) => {
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

  const [txStateMap, setTxStateMap] = useState<{ [index: number]: txState }>({
    0: 'broadcasted',
    1: 'pending',
    2: 'pending',
  });

  useEffect(() => {
    // for testing/demo
    setTimeout(() => {
      setTxStateMap({
        0: 'confirmed',
        1: 'broadcasted',
      });
      setTimeout(() => {
        setTxStateMap({
          0: 'confirmed',
          1: 'confirmed',
          2: 'broadcasted',
        });
        setTimeout(() => {
          setTxStateMap({
            0: 'confirmed',
            1: 'confirmed',
            2: 'confirmed',
          });
        }, 5000);
      }, 5000);
    }, 5000);
  }, []);

  return (
    <StyledSwapExecutionFlowRoute justify="space-between">
      {operations.map((operation, index) => {
        const lastIndex = index === operations.length - 1;

        const simpleOperationType =
          operationTypeToSimpleOperationType[operation.type];

        const getBridgeSwapVenue = () => {
          const bridgeID = operation.bridgeID;
          const swapID = operation.swapVenues?.[0]?.chainID;

          // return the name, not the ID
          return bridgeID ?? swapID;
        };

        const asset = lastIndex
          ? {
              amount: operation.amountOut,
              denom: operation.denomOut ?? operation.denom,
              chainID: operation.toChainID ?? operation.chainID,
            }
          : {
              amount: operation.amountIn,
              denom: operation.denomIn ?? operation.denom,
              chainID: operation.fromChainID ?? operation.chainID,
            };
        return (
          <>
            <SwapExecutionFlowRouteDetailedRow
              {...asset}
              txState={txStateMap[index]}
              key={`row-${asset?.denom}-${index}`}
            />
            {operation !== operations[operations.length - 1] && (
              <Row style={{ height: '25px' }} align="center">
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
                    {simpleOperationType} with {getBridgeSwapVenue()}
                  </Tooltip>
                )}
              </Row>
            )}
          </>
        );
      })}
    </StyledSwapExecutionFlowRoute>
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

const StyledSwapExecutionFlowRoute = styled(Column)`
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
