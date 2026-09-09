import { getSimpleOverallStatus } from "@skip-go/client";
import type { OverallStatus, ClientTransferEvent, TransactionDetails, TransactionState, TransferAssetRelease, TransferEventStatus, TxStatusResponse } from "@skip-go/client";
import type { ClientOperation } from "@/utils/clientType";

export type TransactionPhase = OverallStatus | "planned" | "loading" | "abandoned";
export type TransactionObservation = { status?: TxStatusResponse; events: ClientTransferEvent[] };
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

function getPhase(transaction: TransactionDetails | undefined, status: TxStatusResponse | undefined): TransactionPhase {
  if (!status?.state) return transaction?.txHash ? "loading" : "planned";
  if (status.state === "STATE_ABANDONED") return "abandoned";
  return getSimpleOverallStatus(status.state);
}

/** Matches an ordered event prefix to transfers and their following same-chain operations. */
function getEventPlannedOutputs(operations: ClientOperation[], events: ClientTransferEvent[]): (ClientOperation | undefined)[] {
  const segments: { transfer: ClientOperation; output?: ClientOperation }[] = [];
  let previousChain: string | undefined;
  for (const operation of operations) {
    const from = operationFromChain(operation);
    const to = operationToChain(operation);
    // Do not infer execution-environment aliases or reconnect a discontinuous plan.
    if (!from || !to || (previousChain && from !== previousChain)) return [];
    previousChain = to;
    if (from !== to) {
      segments.push({ transfer: operation, output: operation });
    } else {
      const segment = segments.at(-1);
      if (segment) {
        // Multiple local operations are usable only when their asset flow is explicit.
        segment.output = segment.output?.denomOut && segment.output.denomOut === operation.denomIn
          ? operation : undefined;
      }
    }
  }

  let aligned = true;
  return events.map((event, index) => {
    const segment = segments[index];
    const transfer = segment?.transfer;
    const transferType = transfer?.type === "transfer" ? "ibcTransfer" : transfer?.type;
    // Refunds, missing hops and other mismatches keep their observed data without a guess.
    aligned = aligned && !!transfer && !!event.fromChainId && !!event.toChainId && !!event.transferType &&
      event.fromChainId === operationFromChain(transfer) && event.toChainId === operationToChain(transfer) &&
      event.transferType === transferType;
    return aligned ? segment.output : undefined;
  });
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
    ...Array.from({ length: Math.max(transactions.length, observations.length) }, (_, index) => index),
  ]);
  return [...indices].sort((a, b) => a - b).map(txIndex => ({
    txIndex,
    transaction: transactions[txIndex],
    operations: grouped.get(txIndex) ?? [],
    status: observations[txIndex]?.status,
    events: observations[txIndex]?.events ?? [],
    phase: getPhase(transactions[txIndex], observations[txIndex]?.status),
  }));
}

/** Displays observed events when available, otherwise the planned operations with tx-level status. */
export function getTimelineCards(route: RouteTransaction[]): TimelineCard[] {
  const cards: TimelineCard[] = [];
  const latestRelease = route.findLast(tx => tx.status?.transferAssetRelease?.released);
  for (const tx of route) {
    const plannedOutputs = getEventPlannedOutputs(tx.operations, tx.events);
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

    if (tx.phase === "failed" && endpoint.timeline.source === "event") {
      const output = plannedOutputs[tx.events.findLastIndex(event => !!event.toChainId)];
      // Display policy is separate from matching; actual releases below take precedence.
      if (output?.denomOut && output.amountOut) {
        endpoint.timeline.asset = {
          chainId: endpoint.chainId, denom: output.denomOut, amount: output.amountOut, estimated: true,
        };
      }
    }

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
  const lastCard = cards.at(-1);
  if (lastCard && lastCard.step !== "Origin" && lastCard.txIndex === finalTransaction?.txIndex
    && (finalTransaction.phase === "failed" || !destinationChain || lastCard.chainId === destinationChain)) lastCard.step = "Destination";
  return cards;
}
