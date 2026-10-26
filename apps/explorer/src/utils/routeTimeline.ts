import { getSimpleOverallStatus, getTransferEventsFromTxStatusResponse } from "@skip-go/client";
import type { OverallStatus, RouteStatus, ClientTransferEvent, TransactionDetails, TransactionState, TransferAssetRelease, TransferEventStatus, TxStatusResponse } from "@skip-go/client";
import type { ClientOperation } from "@/utils/clientType";

export type TransactionPhase = OverallStatus | "canceled" | "loading" | "abandoned";
export type RouteTransaction = {
  txIndex: number;
  transaction?: TransactionDetails;
  operations: ClientOperation[];
  status?: TxStatusResponse;
  events: ClientTransferEvent[];
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

const transferType = (operation: ClientOperation) => operation.type === "transfer" ? "ibcTransfer" : operation.type;

/** Supplements the last failed event's asset without determining which cards are shown. */
function getFailedEventAsset(tx: RouteTransaction): TimelineAsset | undefined {
  const lastEvent = tx.events.findLast(event => event.toChainId);
  if (tx.phase !== "failed" || !lastEvent) return;
  const outputs: { transfer: ClientOperation; output: ClientOperation; event?: ClientTransferEvent }[] = [];
  for (const operation of tx.operations) {
    const previous = outputs.at(-1);
    const denomOut = previous?.output.denomOut;
    const denomIn = operation.denomIn;
    const sameDenom = !!denomOut && !!denomIn && (denomOut === denomIn ||
      (/^0x[0-9a-f]{40}$/i.test(denomOut) && denomOut.toLowerCase() === denomIn.toLowerCase()));
    if (previous && operationFromChain(operation) === operationToChain(operation) &&
      operationToChain(previous.output) === operationFromChain(operation) && sameDenom) {
      previous.output = operation;
    } else {
      outputs.push({ transfer: operation, output: operation });
    }
  }

  let previousIndex = -1;
  for (const event of tx.events) {
    const matches = outputs.flatMap(({ transfer }, index) => {
      return !!event.transferType && operationFromChain(transfer) !== operationToChain(transfer) &&
        event.fromChainId === operationFromChain(transfer) && event.toChainId === operationToChain(transfer) &&
        event.transferType === transferType(transfer) ? [index] : [];
    });
    const index = matches[0];
    // Repeated or reordered transfers cannot establish which planned output belongs to the event.
    if (matches.length === 1 && index > previousIndex && !outputs[index].event) {
      outputs[index].event = event;
      previousIndex = index;
    }
  }
  const output = outputs.find(output => output.event === lastEvent)?.output;
  return output?.denomOut
    ? { chainId: lastEvent.toChainId, denom: output.denomOut, amount: output.amountOut, estimated: true }
    : undefined;
}

/** Groups route operations, transaction details and status responses by txIndex. */
export function buildRouteTransactions(
  operations: ClientOperation[],
  transactions: readonly TransactionDetails[] = [],
  statuses: readonly (TxStatusResponse | undefined)[] = [],
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
    ...Array.from({ length: Math.max(transactions.length, statuses.length) }, (_, index) => index),
  ]);
  return [...indices].sort((a, b) => a - b).map(txIndex => {
    const status = statuses[txIndex];
    const transaction = transactions[txIndex];
    let phase: TransactionPhase;
    if (!status?.state) phase = transaction?.txHash ? "loading" : "canceled";
    else if (status.state === "STATE_ABANDONED") phase = "abandoned";
    else phase = getSimpleOverallStatus(status.state);
    return {
      txIndex,
      transaction,
      operations: grouped.get(txIndex) ?? [],
      status,
      events: status ? getTransferEventsFromTxStatusResponse([status]) : [],
      phase,
    };
  });
}

/** Selects one card source per tx, then applies shared route endpoints and actual releases. */
export function getTimelineCards(route: RouteTransaction[], routeStatus?: RouteStatus): TimelineCard[] {
  const isTracking = route.some(tx => tx.phase === "loading" || tx.phase === "pending" || tx.status?.state === "STATE_PENDING_ERROR");
  // The URL is a snapshot; finished polling must also reveal steps without a hash.
  const showRemainingSteps = !isTracking && ((route.some(tx => tx.phase === "canceled") &&
    (routeStatus === "failed" || routeStatus === "incomplete" || route.some(tx => tx.phase === "success"))) ||
    route.some(tx => tx.status?.state === "STATE_COMPLETED_ERROR" || tx.phase === "abandoned"));
  const cards: TimelineCard[] = [];
  for (const tx of route) {
    if (tx.phase === "canceled" && !showRemainingSteps) continue;
    const firstOperation = tx.operations[0];
    const firstEvent = tx.events[0];
    const originChain = firstEvent?.fromChainId || (firstOperation && operationFromChain(firstOperation));
    if (!cards.length && originChain) {
      cards.push({
        id: `${tx.txIndex}:origin`, txIndex: tx.txIndex, chainId: originChain,
        explorerLink: firstEvent?.fromExplorerLink || tx.transaction?.explorerLink || "",
        transferType: firstEvent?.transferType ?? (firstOperation ? transferType(firstOperation) : ""),
        step: "Origin", status: tx.events.length || tx.phase === "success" ? "completed" : undefined,
        state: tx.status?.state,
        timeline: {
          source: "origin", phase: tx.phase, isTransactionEnd: false, canRecover: false,
          asset: firstOperation?.denomIn ? { chainId: originChain, denom: firstOperation.denomIn, amount: firstOperation.amountIn, estimated: true } : undefined,
        },
      });
    }

    const start = cards.length;
    if (tx.events.length) {
      // Observed events determine the route, links and progress.
      const lastEventIndex = tx.events.findLastIndex(event => event.toChainId);
      const failedAsset = getFailedEventAsset(tx);
      tx.events.forEach((event, index) => {
        if (!event.toChainId) return;
        cards.push({
          id: `${tx.txIndex}:event:${index}`, txIndex: tx.txIndex,
          chainId: event.toChainId, explorerLink: event.toExplorerLink ?? "",
          transferType: event.transferType ?? "", step: "Routed",
          status: event.status, state: tx.status?.state, durationInMs: event.durationInMs,
          timeline: {
            source: "event", phase: tx.phase, isTransactionEnd: false, canRecover: false,
            asset: index === lastEventIndex ? failedAsset : undefined,
          },
        });
      });
    } else {
      // Without events, polling cannot establish progress through subsequent operations.
      const operations = tx.phase === "pending" || tx.phase === "loading" || tx.status?.state === "STATE_PENDING_ERROR"
        ? tx.operations.slice(0, 1) : tx.operations;
      operations.forEach((operation, index) => {
        const chainId = operationToChain(operation);
        if (!chainId) return;
        cards.push({
          id: `${tx.txIndex}:operation:${index}`, txIndex: tx.txIndex, chainId,
          explorerLink: tx.phase !== "canceled" && tx.transaction?.chainId === chainId ? tx.transaction.explorerLink ?? "" : "",
          transferType: transferType(operation), step: "Routed",
          status: tx.phase === "success" ? "completed" : undefined, state: tx.status?.state,
          timeline: {
            source: "operation", phase: tx.phase, isTransactionEnd: false, canRecover: false,
            asset: operation.denomOut ? { chainId, denom: operation.denomOut, amount: operation.amountOut, estimated: true } : undefined,
          },
        });
      });
    }
    const endpoint = cards.at(-1);
    if (endpoint && cards.length > start) endpoint.timeline.isTransactionEnd = true;
  }

  // Actual releases take precedence over planned assets, including refunds.
  const latestRelease = route.findLast(tx => tx.status?.transferAssetRelease?.released);
  for (const tx of route) {
    const release = tx.status?.transferAssetRelease;
    if (!release?.released || !release.chainId || !release.denom) continue;
    const candidates = cards.filter(card => card.txIndex === tx.txIndex);
    let target = candidates.findLast(card => card.chainId === release.chainId);
    if (!target) {
      target = {
        id: `${tx.txIndex}:release`, txIndex: tx.txIndex, chainId: release.chainId,
        explorerLink: "", transferType: "", step: "Routed", state: tx.status?.state,
        timeline: { source: "event", phase: tx.phase, isTransactionEnd: false, canRecover: false },
      };
      const last = candidates.at(-1);
      cards.splice(last ? cards.indexOf(last) + 1 : cards.length, 0, target);
    }
    target.transferAssetRelease = release;
    target.timeline.asset = { chainId: release.chainId, denom: release.denom, amount: release.amount, estimated: false };
    target.timeline.canRecover = tx === latestRelease && showRemainingSteps && (
      tx.phase === "failed" || tx.phase === "abandoned" ||
      route.some(other => other.txIndex > tx.txIndex && other.phase !== "success")
    );
  }

  const finalTransaction = route.at(-1);
  const finalOperation = finalTransaction?.operations.at(-1);
  const destinationChain = finalOperation && operationToChain(finalOperation);
  const lastCard = cards.at(-1);
  if (lastCard && lastCard.step !== "Origin" && lastCard.txIndex === finalTransaction?.txIndex &&
    (finalTransaction.phase === "failed" || !destinationChain || lastCard.chainId === destinationChain)) lastCard.step = "Destination";
  return cards;
}
