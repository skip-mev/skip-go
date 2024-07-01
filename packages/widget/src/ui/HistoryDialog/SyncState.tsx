import { RouteResponse, SkipRouter, TxStatusResponse } from '@skip-go/core';
import { differenceInMinutes, parseISO } from 'date-fns';
import { useCallback, useEffect } from 'react';
import { useSkipClient } from '../../hooks/use-skip-client';
import { txHistory, TxHistoryItem } from '../../store/tx-history';

export function useSyncState() {
  const skipClient = useSkipClient();

  const sync = useCallback(
    async (skipIfOlderThanMinutes?: number) => {
      for (const [id, historyItem] of Object.entries(history)) {
        if (
          skipIfOlderThanMinutes &&
          differenceInMinutes(new Date(), parseISO(historyItem.timestamp)) >
            skipIfOlderThanMinutes
        ) {
          continue;
        }

        if (historyItem.status === 'pending') {
          await updatePendingRoute(id, historyItem, skipClient);
        }

        if (historyItemIsMissingAxelarlarscanLink(historyItem)) {
          await updateAxelarscanLink(id, historyItem, skipClient);
        }
      }
    },
    [skipClient]
  );

  return sync;
}

export function SyncState({
  skipIfOlderThanMinutes,
}: {
  skipIfOlderThanMinutes?: number;
}) {
  const sync = useSyncState();

  useEffect(() => {
    sync(skipIfOlderThanMinutes);
  }, [sync, skipIfOlderThanMinutes]);

  return null;
}

///////////////////////////////////////////////////////////////////////////////

function routeHasAxelarTransfer(route: RouteResponse): boolean {
  for (const operation of route.operations) {
    if ('axelarTransfer' in operation) {
      return true;
    }
  }
  return false;
}

function historyItemIsMissingAxelarlarscanLink(historyItem: TxHistoryItem) {
  if (!routeHasAxelarTransfer(historyItem.route)) {
    return false;
  }

  for (const tx of historyItem.txStatus) {
    if (tx.axelarscanLink) {
      return false;
    }
  }

  return true;
}

function maybeGetAxelarscanLinkFromTransactionStatus(
  status: TxStatusResponse
): string | undefined {
  for (const seqEvent of status.transferSequence) {
    if ('axelarTransfer' in seqEvent) {
      if ('contractCallWithTokenTxs' in seqEvent.axelarTransfer.txs) {
        return seqEvent.axelarTransfer.txs.contractCallWithTokenTxs.sendTx
          ? `https://axelarscan.io/gmp/${seqEvent.axelarTransfer.txs.contractCallWithTokenTxs.sendTx.txHash}`
          : undefined;
      }

      if ('sendTokenTxs' in seqEvent.axelarTransfer.txs) {
        return seqEvent.axelarTransfer.txs.sendTokenTxs.sendTx
          ? `https://axelarscan.io/transfer/${seqEvent.axelarTransfer.txs.sendTokenTxs.sendTx.txHash}`
          : undefined;
      }
    }
  }
  return undefined;
}

async function updatePendingRoute(
  id: string,
  historyItem: TxHistoryItem,
  skipClient: SkipRouter
) {
  const firstTx =
    historyItem.txStatus.length > 0 ? historyItem.txStatus[0] : undefined;

  if (!firstTx) {
    return;
  }

  try {
    const status = await skipClient.transactionStatus({
      chainID: firstTx.chainId,
      txHash: firstTx.txHash,
    });

    if (status.state === 'STATE_COMPLETED_SUCCESS') {
      txHistory.success(id);
    }

    if (status.state === 'STATE_COMPLETED_ERROR') {
      txHistory.fail(id);
    }
  } catch {
    // Sometimes this is called before the API knows about the transaction. We can probably safely ignore errors.
  }
}

async function updateAxelarscanLink(
  id: string,
  historyItem: TxHistoryItem,
  skipClient: SkipRouter
) {
  for (const tx of historyItem.txStatus) {
    try {
      const status = await skipClient.transactionStatus({
        chainID: tx.chainId,
        txHash: tx.txHash,
      });

      const axelarscanLink =
        maybeGetAxelarscanLinkFromTransactionStatus(status);

      if (axelarscanLink && !tx.axelarscanLink) {
        if (axelarscanLink) {
          txHistory.updateStatus(id, {
            ...tx,
            axelarscanLink,
          });
        }
      }
    } catch {
      /* empty */
    }
  }
}
