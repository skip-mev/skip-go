import {
  AxelarTransfer,
  AxelarTransferInfo,
  AxelarTransferState,
  BankSend,
  CCTPTransfer,
  CCTPTransferInfo,
  CCTPTransferState,
  EvmSwap,
  GoFastTransfer,
  GoFastTransferInfo,
  GoFastTransferState,
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

export type OverallStatus = "pending" | "success" | "failed"

export enum OperationType {
  swap = "swap",
  evmSwap = "evmSwap",
  transfer = "transfer",
  axelarTransfer = "axelarTransfer",
  cctpTransfer = "cctpTransfer",
  hyperlaneTransfer = "hyperlaneTransfer",
  opInitTransfer = "opInitTransfer",
  bankSend = "bankSend",
  goFastTransfer = "goFastTransfer",
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
  goFastTransfer?: GoFastTransfer;
};

type OperationDetails = CombineObjectTypes<
  Transfer &
  BankSend &
  Swap &
  AxelarTransfer &
  CCTPTransfer &
  HyperlaneTransfer &
  EvmSwap &
  OPInitTransfer &
  GoFastTransfer
> & {
  swapIn?: {
    swapVenue: SwapVenue;
  };
  swapOut?: {
    swapVenue: SwapVenue;
  };
};

export type ClientOperation = {
  transferIndex: number;
  signRequired: boolean;
  isSwap: boolean;
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
          (operationDetails as Transfer).fromChainID = (
            operationDetails as BankSend
          ).chainID;
          (operationDetails as Transfer).toChainID = (
            operationDetails as BankSend
          ).chainID;
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
  let transferIndex = 0;
  return operations.map((operation, index, arr) => {
    const prevOperation = arr[index - 1];

    const signRequired = (() => {
      if (index === 0) {
        return false;
      } else {
        if (operation.txIndex > prevOperation.txIndex) {
          return true;
        }
        return false;
      }
    })();
    const clientOperation = getClientOperation(operation);
    const isSwap =
      clientOperation.type === OperationType.swap ||
      clientOperation.type === OperationType.evmSwap;
    const result = {
      ...clientOperation,
      transferIndex,
      signRequired,
      isSwap,
    };
    if (!isSwap) {
      transferIndex++;
    }
    return result;
  });
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
  const goFastTransfer = combinedTransferEvent?.goFastTransfer as GoFastTransferInfo;

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
  } else if (goFastTransfer) {
    transferType = TransferType.goFastTransfer;
  }

  const getExplorerLink = (type: "send" | "receive") => {
    switch (transferType) {
      case TransferType.ibcTransfer:
        if (type === "send") {
          return ibcTransfer.packetTXs.sendTx?.explorerLink;
        }
        return ibcTransfer.packetTXs.receiveTx?.explorerLink;
      case TransferType.goFastTransfer:
        if (type === "send") {
          return goFastTransfer.txs.orderSubmittedTx?.explorerLink;
        }
        return goFastTransfer.txs.orderFilledTx?.explorerLink;
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
  const _result = {
    ...ibcTransfer,
    ...axelarTransfer,
    ...cctpTransfer,
    ...hyperlaneTransfer,
    ...opInitTransfer,
    ...goFastTransfer,
    fromExplorerLink: getExplorerLink("send"),
    toExplorerLink: getExplorerLink("receive"),
  } as ClientTransferEvent;
  const status = getSimpleStatus(_result.state);
  const result = {
    ..._result,
    status,
  };
  return result;
}

export function getTransferEventsFromTxStatusResponse(
  txStatusResponse?: TxStatusResponse[]
) {
  if (!txStatusResponse) return [];
  return txStatusResponse?.flatMap((txStatus) => {
    return txStatus.transferSequence.map((transferEvent) => {
      return getClientTransferEvent(transferEvent);
    });
  });
}

export function getSimpleOverallStatus(state: StatusState): OverallStatus {
  switch (state) {
    case "STATE_SUBMITTED":
    case "STATE_PENDING":
      return "pending";
    case "STATE_COMPLETED_SUCCESS":
      return "success";
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
    | GoFastTransferState
): SimpleStatus {
  switch (state) {
    case "TRANSFER_PENDING":
    case "TRANSFER_RECEIVED":
    case "AXELAR_TRANSFER_PENDING_CONFIRMATION":
    case "AXELAR_TRANSFER_PENDING_RECEIPT":
    case "CCTP_TRANSFER_SENT":
    case "CCTP_TRANSFER_PENDING_CONFIRMATION":
    case "CCTP_TRANSFER_CONFIRMED":
    case "HYPERLANE_TRANSFER_SENT":
    case "OPINIT_TRANSFER_SENT":
    case "GO_FAST_TRANSFER_SENT":
      return "pending";
    case "TRANSFER_SUCCESS":
    case "AXELAR_TRANSFER_SUCCESS":
    case "CCTP_TRANSFER_RECEIVED":
    case "HYPERLANE_TRANSFER_RECEIVED":
    case "OPINIT_TRANSFER_RECEIVED":
    case "GO_FAST_TRANSFER_FILLED":
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
  [TransferType.goFastTransfer]: GoFastTransferInfo;
};

export enum TransferType {
  ibcTransfer = "ibcTransfer",
  axelarTransfer = "axelarTransfer",
  cctpTransfer = "cctpTransfer",
  hyperlaneTransfer = "hyperlaneTransfer",
  opInitTransfer = "opInitTransfer",
  goFastTransfer = "goFastTransfer",
}

export type SimpleStatus =
  | "unconfirmed"
  | "signing"
  | "pending"
  | "completed"
  | "failed";

export type ClientTransferEvent = {
  fromChainID: string;
  toChainID: string;
  state:
  | TransferState
  | AxelarTransferState
  | CCTPTransferState
  | HyperlaneTransferState
  | OPInitTransferState
  | GoFastTransferState;
  status?: SimpleStatus;
  fromExplorerLink?: string;
  toExplorerLink?: string;
  explorerLink?: string;
};
