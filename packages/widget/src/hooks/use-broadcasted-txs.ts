import { ChainTransaction, TransferState, StatusState } from '@skip-go/core';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useSkipClient } from './use-skip-client';

interface TransferSequence {
  srcChainID: string;
  destChainID: string;
  txs: {
    sendTx: ChainTransaction | null;
    receiveTx: ChainTransaction | null;
  };
  state: TransferState;
}

export const useBroadcastedTxsStatus = ({
  txs,
  txsRequired,
  enabled,
}: {
  txsRequired: number;
  txs: { chainID: string; txHash: string }[] | undefined;
  enabled?: boolean;
}) => {
  const skipClient = useSkipClient();
  const [isSettled, setIsSettled] = useState(false);
  const [prevData, setPrevData] = useState<
    | {
        isSuccess: boolean;
        isSettled: boolean;
        transferSequence: TransferSequence[];
        states: StatusState[];
      }
    | undefined
  >(undefined);
  const queryKey = useMemo(
    () => ['solve-txs-status', txsRequired, txs] as const,
    [txs, txsRequired]
  );

  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, txsRequired, txs] }) => {
      if (!txs) return;
      const result = await Promise.all(
        txs.map(async (tx) => {
          const _res = await skipClient.transactionStatus({
            chainID: tx.chainID,
            txHash: tx.txHash,
          });
          const cleanTransferSequence = _res.transferSequence.map(
            (transfer) => {
              if ('ibcTransfer' in transfer) {
                return {
                  srcChainID: transfer.ibcTransfer.srcChainID,
                  destChainID: transfer.ibcTransfer.dstChainID,
                  txs: {
                    sendTx: transfer.ibcTransfer.packetTXs.sendTx,
                    receiveTx: transfer.ibcTransfer.packetTXs.receiveTx,
                  },
                  state: transfer.ibcTransfer.state,
                };
              }
              if ('cctpTransfer' in transfer) {
                const cctpState: TransferState = (() => {
                  switch (transfer.cctpTransfer.state) {
                    case 'CCTP_TRANSFER_SENT':
                      return 'TRANSFER_PENDING';
                    case 'CCTP_TRANSFER_PENDING_CONFIRMATION':
                      return 'TRANSFER_PENDING';
                    case 'CCTP_TRANSFER_CONFIRMED':
                      return 'TRANSFER_PENDING';
                    case 'CCTP_TRANSFER_RECEIVED':
                      return 'TRANSFER_SUCCESS';
                    default:
                      return 'TRANSFER_UNKNOWN';
                  }
                })();
                return {
                  srcChainID: transfer.cctpTransfer.srcChainID,
                  destChainID: transfer.cctpTransfer.dstChainID,
                  txs: {
                    sendTx: transfer.cctpTransfer.txs.sendTx,
                    receiveTx: transfer.cctpTransfer.txs.receiveTx,
                  },
                  state: cctpState,
                };
              }
              if ('hyperlaneTransfer' in transfer) {
                const hyperlaneState: TransferState = (() => {
                  switch (transfer.hyperlaneTransfer.state) {
                    case 'HYPERLANE_TRANSFER_SENT':
                      return 'TRANSFER_PENDING';
                    case 'HYPERLANE_TRANSFER_FAILED':
                      return 'TRANSFER_FAILURE';
                    case 'HYPERLANE_TRANSFER_RECEIVED':
                      return 'TRANSFER_SUCCESS';
                    case 'HYPERLANE_TRANSFER_UNKNOWN':
                      return 'TRANSFER_UNKNOWN';
                    default:
                      return 'TRANSFER_UNKNOWN';
                  }
                })();
                return {
                  srcChainID: transfer.hyperlaneTransfer.fromChainID,
                  destChainID: transfer.hyperlaneTransfer.toChainID,
                  txs: {
                    sendTx: transfer.hyperlaneTransfer.txs.sendTx,
                    receiveTx: transfer.hyperlaneTransfer.txs.receiveTx,
                  },
                  state: hyperlaneState,
                };
              }
              if ('opInitTransfer' in transfer) {
                const opInitState: TransferState = (() => {
                  switch (transfer.opInitTransfer.state) {
                    case 'OPINIT_TRANSFER_SENT':
                      return 'TRANSFER_PENDING';
                    case 'OPINIT_TRANSFER_RECEIVED':
                      return 'TRANSFER_SUCCESS';
                    case 'OPINIT_TRANSFER_UNKNOWN':
                      return 'TRANSFER_UNKNOWN';
                    default:
                      return 'TRANSFER_UNKNOWN';
                  }
                })();
                return {
                  srcChainID: transfer.opInitTransfer.fromChainID,
                  destChainID: transfer.opInitTransfer.toChainID,
                  txs: {
                    sendTx: transfer.opInitTransfer.txs.sendTx,
                    receiveTx: transfer.opInitTransfer.txs.receiveTx,
                  },
                  state: opInitState,
                };
              }
              const axelarState: TransferState = (() => {
                switch (transfer.axelarTransfer.state) {
                  case 'AXELAR_TRANSFER_PENDING_RECEIPT':
                    return 'TRANSFER_PENDING';
                  case 'AXELAR_TRANSFER_PENDING_CONFIRMATION':
                    return 'TRANSFER_PENDING';
                  case 'AXELAR_TRANSFER_FAILURE':
                    return 'TRANSFER_FAILURE';
                  case 'AXELAR_TRANSFER_SUCCESS':
                    return 'TRANSFER_SUCCESS';
                  default:
                    return 'TRANSFER_UNKNOWN';
                }
              })();
              if ('contractCallWithTokenTxs' in transfer.axelarTransfer.txs) {
                return {
                  srcChainID: transfer.axelarTransfer.srcChainID,
                  destChainID: transfer.axelarTransfer.dstChainID,
                  txs: {
                    sendTx:
                      transfer.axelarTransfer.txs.contractCallWithTokenTxs
                        .sendTx,
                    receiveTx:
                      transfer.axelarTransfer.txs.contractCallWithTokenTxs
                        .executeTx,
                  },
                  state: axelarState,
                };
              }
              return {
                srcChainID: transfer.axelarTransfer.srcChainID,
                destChainID: transfer.axelarTransfer.dstChainID,
                txs: {
                  sendTx: transfer.axelarTransfer.txs.sendTokenTxs.sendTx,
                  receiveTx: transfer.axelarTransfer.txs.sendTokenTxs.executeTx,
                },
                state: axelarState,
              };
            }
          );
          return {
            state: _res.state,
            transferSequence: cleanTransferSequence,
          };
        })
      );
      const _isSettled = result.every((tx) => {
        return (
          tx.state === 'STATE_COMPLETED_SUCCESS' ||
          tx.state === 'STATE_COMPLETED_ERROR' ||
          tx.state === 'STATE_ABANDONED'
        );
      });

      const _isSuccess = result.every((tx) => {
        return tx.state === 'STATE_COMPLETED_SUCCESS';
      });

      if (result.length > 0 && txsRequired === result.length && _isSettled) {
        setIsSettled(true);
      }

      const mergedTransferSequence = result.reduce<TransferSequence[]>(
        (acc, tx) => {
          return acc.concat(...tx.transferSequence);
        },
        []
      );

      const resData = {
        isSuccess: _isSuccess,
        isSettled: _isSettled,
        transferSequence: mergedTransferSequence,
        states: result.map((tx) => tx.state),
      };
      setPrevData(resData);
      return resData;
    },
    enabled:
      !isSettled &&
      (!!txs && txs.length > 0 && enabled !== undefined ? enabled : true),
    refetchInterval: 1000 * 2,
    // to make the data persist when query key changed
    initialData: prevData,
  });
};
