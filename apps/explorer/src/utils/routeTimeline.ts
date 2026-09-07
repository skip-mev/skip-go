import type { ClientTransferEvent, TransactionDetails, TransactionState, TransferAssetRelease, TransferEventStatus, TxStatusResponse } from "@skip-go/client";
import type { ClientOperation } from "@/utils/clientType";

export type TransactionPhase = "planned" | "loading" | "waiting" | "pending" | "completed" | "failed" | "abandoned";
export type TransactionObservation = { status?: TxStatusResponse; events: ClientTransferEvent[]; queryFailed?: boolean };
export type RouteTransaction = TransactionObservation & {
  txIndex: number;
  transaction?: TransactionDetails;
  operations: ClientOperation[];
  phase: TransactionPhase;
};
export type TimelineAsset = { chainId: string; denom: string; amount?: string; estimated: boolean };
export type TimelineCard = {
  id: string;
  txIndex: number;
  chainId: string;
  explorerLink: string;
  transferType: string;
  step: "Origin" | "Routed" | "Destination";
  status?: TransferEventStatus;
  state?: TransactionState;
  durationInMs?: number;
  transferAssetRelease?: TransferAssetRelease;
  timeline: {
    source: "origin" | "event" | "operation";
    phase: TransactionPhase;
    isTransactionEnd: boolean;
    asset?: TimelineAsset;
    canRecover: boolean;
  };
};

export const operationFromChain = (op: ClientOperation): string | undefined => op.fromChainId || op.chainId;
export const operationToChain = (op: ClientOperation): string | undefined => op.toChainId || op.chainId || (op.isSwap ? op.fromChainId : undefined);

function getPhase(transaction: TransactionDetails | undefined, status: TxStatusResponse | undefined, queryFailed = false): TransactionPhase {
  switch (status?.state) {
    case "STATE_COMPLETED_SUCCESS": return "completed";
    case "STATE_COMPLETED_ERROR":
    case "STATE_PENDING_ERROR": return "failed";
    case "STATE_ABANDONED": return "abandoned";
    case "STATE_SUBMITTED":
    case "STATE_PENDING": return "pending";
    default: return transaction?.txHash ? (queryFailed ? "waiting" : "loading") : "planned";
  }
}

/** Groups the entire plan and observations by txIndex; chain IDs never identify a transaction. */
export function buildRouteTransactions(
  operations: ClientOperation[],
  transactions: readonly TransactionDetails[] = [],
  observations: readonly (TransactionObservation | undefined)[] = [],
): RouteTransaction[] {
  const grouped = new Map<number, ClientOperation[]>();
  for (const operation of operations) {
    if (!Number.isInteger(operation.txIndex) || operation.txIndex < 0) continue;
    const group = grouped.get(operation.txIndex) ?? [];
    group.push(operation);
    grouped.set(operation.txIndex, group);
  }
  const indices = new Set<number>([
    ...grouped.keys(),
    ...Array.from({ length: transactions.length }, (_, index) => index),
    ...Array.from({ length: observations.length }, (_, index) => index),
  ]);
  return [...indices].sort((a, b) => a - b).map(txIndex => ({
    txIndex,
    transaction: transactions[txIndex],
    operations: grouped.get(txIndex) ?? [],
    status: observations[txIndex]?.status,
    events: observations[txIndex]?.events ?? [],
    phase: getPhase(transactions[txIndex], observations[txIndex]?.status, observations[txIndex]?.queryFailed),
  }));
}

/** Displays observed events when available, otherwise the planned operations with tx-level status. */
export function getTimelineCards(route: RouteTransaction[]): TimelineCard[] {
  const cards: TimelineCard[] = [];
  const latestRelease = route.findLast(tx => tx.status?.transferAssetRelease?.released);
  for (const tx of route) {
    const firstOperation = tx.operations[0];
    const originChain = tx.events[0]?.fromChainId || (firstOperation && operationFromChain(firstOperation));
    const start = cards.length;
    if (cards.length === 0 && originChain) {
      cards.push({
        id: `${tx.txIndex}:origin`, txIndex: tx.txIndex, chainId: originChain,
        explorerLink: tx.events[0]?.fromExplorerLink ?? tx.transaction?.explorerLink ?? "",
        transferType: tx.events[0]?.transferType ?? firstOperation?.type ?? "",
        step: "Origin", status: tx.events.length ? "completed" : undefined, state: tx.status?.state,
        timeline: { source: "origin", phase: tx.phase, isTransactionEnd: false, canRecover: false,
          asset: firstOperation?.denomIn ? { chainId: originChain, denom: firstOperation.denomIn, amount: firstOperation.amountIn, estimated: true } : undefined },
      });
    }
    if (tx.events.length) {
      tx.events.forEach((event, index) => {
        if (!event.toChainId) return;
        cards.push({
          id: `${tx.txIndex}:event:${index}`, txIndex: tx.txIndex, chainId: event.toChainId,
          explorerLink: event.toExplorerLink ?? "",
          transferType: event.transferType ?? "", step: "Routed", status: event.status,
          state: tx.status?.state, durationInMs: event.durationInMs,
          timeline: { source: "event", phase: tx.phase, isTransactionEnd: false, canRecover: false },
        });
      });
    } else {
      tx.operations.forEach((operation, index) => {
        const chainId = operationToChain(operation);
        if (!chainId) return;
        cards.push({
          id: `${tx.txIndex}:operation:${index}`, txIndex: tx.txIndex, chainId,
          explorerLink: tx.transaction?.explorerLink ?? "",
          transferType: operation.type === "transfer" ? "ibcTransfer" : operation.type ?? "",
          step: "Routed", state: tx.status?.state,
          timeline: { source: "operation", phase: tx.phase, isTransactionEnd: false, canRecover: false,
            asset: operation.denomOut ? { chainId, denom: operation.denomOut, amount: operation.amountOut, estimated: true } : undefined },
        });
      });
    }
    const endpoint = cards.at(-1);
    if (!endpoint || cards.length === start) continue;
    endpoint.timeline.isTransactionEnd = true;

    const release = tx.status?.transferAssetRelease;
    if (release?.released && release.chainId && release.denom) {
      // Keep the actual release's chain/denom, including EVM/Cosmos boundaries and refunds.
      const releaseCard = cards.slice(start).findLast(card => card.chainId === release.chainId) ?? endpoint;
      releaseCard.transferAssetRelease = release;
      releaseCard.timeline.asset = { chainId: release.chainId, denom: release.denom, amount: release.amount, estimated: false };
      const later = route.filter(other => other.txIndex > tx.txIndex);
      releaseCard.timeline.canRecover = tx === latestRelease && (
        tx.phase === "failed" || tx.phase === "abandoned" ||
        later.some(other => other.phase === "failed" || other.phase === "abandoned") ||
        (later.length > 0 && !later.some(other => other.transaction?.txHash))
      );
    }
  }
  const finalTransaction = route.at(-1);
  const finalOperation = finalTransaction?.operations.at(-1);
  const destinationChain = finalOperation && operationToChain(finalOperation);
  cards.forEach((card, index) => {
    if (card.step !== "Origin") card.step = index === cards.length - 1
      && card.txIndex === finalTransaction?.txIndex && (!destinationChain || card.chainId === destinationChain)
      ? "Destination" : "Routed";
  });
  return cards;
}
