import {
  AxelarTransfer,
  AxelarTransferInfo,
  AxelarTransferState,
  BankSend,
  CCTPTransfer,
  CCTPTransferInfo,
  CCTPTransferState,
  EvmSwap,
  HyperlaneTransfer,
  HyperlaneTransferInfo,
  HyperlaneTransferState,
  OPInitTransfer,
  OPInitTransferInfo,
  OPInitTransferState,
  Operation as SkipClientOperation,
  StatusState,
  Swap,
  SwapVenue,
  Transfer,
  TransferEvent,
  TransferInfo,
  TransferState,
  TxStatusResponse,
} from "@skip-go/client";

export enum OperationType {
  swap = "swap",
  evmSwap = "evmSwap",
  transfer = "transfer",
  axelarTransfer = "axelarTransfer",
  cctpTransfer = "cctpTransfer",
  hyperlaneTransfer = "hyperlaneTransfer",
  opInitTransfer = "opInitTransfer",
  bankSend = "bankSend",
}

type CombinedOperation = {
  txIndex: number;
  amountIn: string;
  amountOut: string;
  transfer?: Transfer;
  bankSend?: BankSend;
  swap?: Swap;
  axelarTransfer?: AxelarTransfer;
  cctpTransfer?: CCTPTransfer;
  hyperlaneTransfer?: HyperlaneTransfer;
  evmSwap?: EvmSwap;
  opInitTransfer?: OPInitTransfer;
};

type OperationDetails = CombineObjectTypes<
  Transfer &
  BankSend &
  Swap &
  AxelarTransfer &
  CCTPTransfer &
  HyperlaneTransfer &
  EvmSwap &
  OPInitTransfer
> & {
  swapIn?: {
    swapVenue: SwapVenue;
  };
  swapOut?: {
    swapVenue: SwapVenue;
  };
};

export type ClientOperation = {
  type: OperationType;
  txIndex: number;
  amountIn: string;
  amountOut: string;
} & OperationDetails;

// find keys that are present in each type
type KeysPresentInAll<T> = keyof T extends infer Key
  ? Key extends keyof T
  ? T[Key] extends Record<Key, unknown>
  ? Key
  : never
  : never
  : never;

// find keys that are not present in each type
type KeysNotPresentInAll<T> = keyof T extends infer Key
  ? Key extends keyof T
  ? T[Key] extends Record<Key, unknown>
  ? never
  : Key
  : never
  : never;

// combine multiple types properly and preserve details on if key is optional
type CombineObjectTypes<T> = {
  [K in KeysPresentInAll<T>]: T[K];
} & {
  [K in KeysNotPresentInAll<T>]?: T[K];
};

function getOperationDetailsAndType(operation: SkipClientOperation) {
  const combinedOperation = operation as CombinedOperation;
  let returnValue = {
    details: {} as OperationDetails,
    type: undefined as OperationType | undefined,
  };
  Object.values(OperationType).find((type) => {
    const operationDetails = combinedOperation?.[type];

    if (operationDetails) {
      switch (type) {
        case OperationType.swap:
        case OperationType.evmSwap:
          (operationDetails as Transfer).toChainID = (
            operationDetails as EvmSwap
          ).fromChainID;
          break;
        case OperationType.bankSend:
          (operationDetails as Transfer).denomIn = (
            operationDetails as BankSend
          ).denom;
          (operationDetails as Transfer).denomOut = (
            operationDetails as BankSend
          ).denom;
          break;
        default:
      }
      returnValue = {
        details: operationDetails,
        type,
      };
    }
  });

  return returnValue;
}

export function getClientOperation(operation: SkipClientOperation) {
  const { details, type } = getOperationDetailsAndType(operation);
  return {
    type,
    ...details,
    txIndex: operation.txIndex,
    amountIn: operation.amountIn,
    amountOut: operation.amountOut,
    swapVenues: [
      ...(details.swapVenues ?? []),
      ...(details?.swapIn ? [details?.swapIn.swapVenue] : []),
      ...(details?.swapOut ? [details?.swapOut.swapVenue] : []),
    ],
  } as ClientOperation;
}

export function getClientOperations(operations: SkipClientOperation[]) {
  return operations.map((operation) => getClientOperation(operation));
}

function getClientTransferEvent(transferEvent: TransferEvent) {
  const combinedTransferEvent = transferEvent as CombinedTransferEvent;

  const axelarTransfer =
    combinedTransferEvent?.axelarTransfer as AxelarTransferInfo;
  const ibcTransfer = combinedTransferEvent?.ibcTransfer as TransferInfo;
  const cctpTransfer = combinedTransferEvent?.cctpTransfer as CCTPTransferInfo;
  const hyperlaneTransfer =
    combinedTransferEvent?.hyperlaneTransfer as HyperlaneTransferInfo;
  const opInitTransfer =
    combinedTransferEvent?.opInitTransfer as OPInitTransferInfo;

  let transferType = "" as TransferType;
  if (axelarTransfer) {
    transferType = TransferType.axelarTransfer;
  } else if (ibcTransfer) {
    transferType = TransferType.ibcTransfer;
  } else if (cctpTransfer) {
    transferType = TransferType.cctpTransfer;
  } else if (hyperlaneTransfer) {
    transferType = TransferType.hyperlaneTransfer;
  } else if (opInitTransfer) {
    transferType = TransferType.opInitTransfer;
  }

  const getExplorerLink = (type: "send" | "receive") => {
    switch (transferType) {
      case TransferType.ibcTransfer:
        if (type === "send") {
          return ibcTransfer.packetTXs.sendTx?.explorerLink;
        }
        return ibcTransfer.packetTXs.receiveTx?.explorerLink;
      case TransferType.axelarTransfer:
        return axelarTransfer.axelarScanLink;
      default:
        type RemainingTransferTypes =
          | CCTPTransferInfo
          | HyperlaneTransferInfo
          | OPInitTransferInfo;
        if (type === "send") {
          return (combinedTransferEvent[transferType] as RemainingTransferTypes)
            ?.txs.sendTx?.explorerLink;
        }
        return (combinedTransferEvent[transferType] as RemainingTransferTypes)
          ?.txs.receiveTx?.explorerLink;
    }
  };

  return {
    ...ibcTransfer,
    ...axelarTransfer,
    ...cctpTransfer,
    ...hyperlaneTransfer,
    ...opInitTransfer,
    fromExplorerLink: getExplorerLink("send"),
    toExplorerLink: getExplorerLink("receive"),
  } as ClientTransferEvent;
}

export function getTransferEventsFromTxStatusResponse(
  txStatusResponse?: TxStatusResponse[]
) {
  if (!txStatusResponse) return [];
  return txStatusResponse?.flatMap((txStatus) =>
    txStatus.transferSequence.map((transferEvent) =>
      getClientTransferEvent(transferEvent)
    )
  );
}

export function getOperationToTransferEventsMap(
  txStatusResponse: TxStatusResponse[],
  clientOperations: ClientOperation[]
) {
  if (!txStatusResponse) return {};
  const operationToTransferEventsMap = {} as Record<
    number,
    ClientTransferEvent
  >;
  const transferEvents =
    getTransferEventsFromTxStatusResponse(txStatusResponse);

  clientOperations.forEach((operation, index) => {
    const foundTransferEventMatchingOperation = transferEvents?.find(
      (transferEvent) =>
        transferEvent.fromChainID === operation.fromChainID && transferEvent.toChainID === operation.toChainID
    );

    const foundSwapTransferEvent = transferEvents?.find(
      (transferEvent) => {
        const isSwapType = ["evmSwap", "swap"].includes(operation.type);
        if (!isSwapType) return false;

        const operationStaysOnTheSameChain = operation.fromChainID === operation.toChainID;
        const fromChainMatches = transferEvent.fromChainID === operation.fromChainID;
        const toChainMatches = transferEvent.toChainID === operation.toChainID;

        return operationStaysOnTheSameChain
          ? fromChainMatches || toChainMatches
          : fromChainMatches && toChainMatches;
      }
    );

    if (foundTransferEventMatchingOperation) {
      foundTransferEventMatchingOperation.status = getSimpleStatus(
        foundTransferEventMatchingOperation?.state
      );
      operationToTransferEventsMap[index] = foundTransferEventMatchingOperation;
      operationToTransferEventsMap[index].explorerLink = foundTransferEventMatchingOperation.toExplorerLink;

    } else if (foundSwapTransferEvent) {
      foundSwapTransferEvent.status = getSimpleStatus(
        foundSwapTransferEvent?.state
      );
      operationToTransferEventsMap[index] = { ...foundSwapTransferEvent };
      operationToTransferEventsMap[index].explorerLink = foundSwapTransferEvent.fromExplorerLink;
    }
  });

  return operationToTransferEventsMap;
}

export function getSimpleOverallStatus(state: StatusState) {
  switch (state) {
    case "STATE_SUBMITTED":
    case "STATE_PENDING":
      return "pending";
    case "STATE_COMPLETED_SUCCESS":
      return "completed";
    case "STATE_COMPLETED_ERROR":
    case "STATE_PENDING_ERROR":
    default:
      return "failed";
  }
}

export function getSimpleStatus(
  state:
    | TransferState
    | AxelarTransferState
    | CCTPTransferState
    | HyperlaneTransferState
    | OPInitTransferState
) {
  switch (state) {
    case "TRANSFER_PENDING":
    case "AXELAR_TRANSFER_PENDING_CONFIRMATION":
    case "AXELAR_TRANSFER_PENDING_RECEIPT":
    case "CCTP_TRANSFER_SENT":
    case "CCTP_TRANSFER_PENDING_CONFIRMATION":
    case "CCTP_TRANSFER_CONFIRMED":
    case "HYPERLANE_TRANSFER_SENT":
    case "OPINIT_TRANSFER_SENT":
      return "pending";
    case "TRANSFER_SUCCESS":
    case "AXELAR_TRANSFER_SUCCESS":
    case "CCTP_TRANSFER_RECEIVED":
    case "HYPERLANE_TRANSFER_RECEIVED":
    case "OPINIT_TRANSFER_RECEIVED":
      return "completed";
    default:
      return "failed";
  }
}

type CombinedTransferEvent = {
  [TransferType.ibcTransfer]: TransferInfo;
  [TransferType.axelarTransfer]: AxelarTransferInfo;
  [TransferType.cctpTransfer]: CCTPTransferInfo;
  [TransferType.hyperlaneTransfer]: HyperlaneTransferInfo;
  [TransferType.opInitTransfer]: OPInitTransferInfo;
};

export enum TransferType {
  ibcTransfer = "ibcTransfer",
  axelarTransfer = "axelarTransfer",
  cctpTransfer = "cctpTransfer",
  hyperlaneTransfer = "hyperlaneTransfer",
  opInitTransfer = "opInitTransfer",
}

export type SimpleStatus =
  | "pending"
  | "broadcasted"
  | "completed"
  | "failed"
  | "signing";

export type ClientTransferEvent = {
  fromChainID: string;
  toChainID: string;
  state:
  | TransferState
  | AxelarTransferState
  | CCTPTransferState
  | HyperlaneTransferState
  | OPInitTransferState;
  status?: SimpleStatus;
  fromExplorerLink?: string;
  toExplorerLink?: string;
  explorerLink?: string;
};
