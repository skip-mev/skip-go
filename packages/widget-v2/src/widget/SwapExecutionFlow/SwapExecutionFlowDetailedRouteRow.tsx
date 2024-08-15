import { Row } from '../../components/Layout';
import { Operation } from '@skip-go/client';

export type SwapExecutionFlowDetailedRouteRowProps = {
  operation: Operation;
};

export const SwapExecutionFlowDetailedRouteRow = ({
  operation,
}: SwapExecutionFlowDetailedRouteRowProps) => {
  return <Row gap={25} align="center"></Row>;
};
