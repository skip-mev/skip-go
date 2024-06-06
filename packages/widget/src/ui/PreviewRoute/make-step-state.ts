import { useBroadcastedTxsStatus } from '../../hooks/use-broadcasted-txs';
import { makeExplorerLink } from '../../utils/link';

interface Props {
  statusData?: ReturnType<typeof useBroadcastedTxsStatus>['data'];
  isDestination: boolean;
  index: number;
}

export const makeStepState = (props: Props) => {
  const { statusData, isDestination, index } = props;

  //format:  <operationType>-<swapIndex>-<transferIndex>-<operationIndex>
  const data = statusData?.transferSequence[isDestination ? index - 1 : index];

  if (isDestination) {
    return {
      isSuccess: data?.state === 'TRANSFER_SUCCESS',
      isLoading: false,
      isError: false,
      state: data?.state,
      explorerLink:
        data &&
        data.txs.receiveTx &&
        makeExplorerLink(data.txs.receiveTx.explorerLink),
    };
  }
  return {
    isSuccess:
      data?.state === 'TRANSFER_SUCCESS' || data?.state === 'TRANSFER_RECEIVED',
    isLoading: data?.state === 'TRANSFER_PENDING',
    isError:
      data?.state === 'TRANSFER_FAILURE' || data?.state === 'TRANSFER_UNKNOWN',
    state: data?.state,
    explorerLink:
      data && data.txs.sendTx && makeExplorerLink(data.txs.sendTx.explorerLink),
  };
};
