import type { TxStatusResponse } from "../api/postTransactionStatus";
import type {
  AxelarTransfer,
  AxelarTransferInfo,
  AxelarTransferState,
  BankSend,
  CCTPTransfer,
  CCTPTransferInfo,
  CCTPTransferState,
  EurekaTransfer,
  EurekaTransferInfo,
  EvmSwap,
  GoFastTransfer,
  GoFastTransferInfo,
  GoFastTransferState,
  HyperlaneTransfer,
  HyperlaneTransferInfo,
  HyperlaneTransferState,
  IBCTransferInfo,
  LayerZeroTransfer,
  LayerZeroTransferInfo,
  LayerZeroTransferState,
  Operation,
  OPInitTransfer,
  OPInitTransferInfo,
  OPInitTransferState,
  StargateTransfer,
  StargateTransferInfo,
  StargateTransferState,
  Swap,
  SwapExactCoinIn,
  SwapExactCoinOut,
  TransactionState,
  Transfer,
  TransferEvent,
  TransferState,
  TransferStatus,
} from "../types/swaggerTypes";

export type OverallStatus = "pending" | "success" | "failed";

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
  stargateTransfer = "stargateTransfer",
  eurekaTransfer = "eurekaTransfer",
  layerZeroTransfer = "layerZeroTransfer",
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
  stargateTransfer?: StargateTransfer;
  eurekaTransfer?: EurekaTransfer;
  layerZeroTransfer?: LayerZeroTransfer;
};

type OperationDetails = CombineObjectTypes<
  Transfer &
    BankSend &
    Swap &
    AxelarTransfer &
    CCTPTransfer &
    HyperlaneTransfer &
    EvmSwap &
    StargateTransfer &
    OPInitTransfer &
    GoFastTransfer &
    EurekaTransfer &
    LayerZeroTransfer
> & {
  swapIn?: SwapExactCoinIn;
  swapOut?: SwapExactCoinOut;
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

function getOperationDetailsAndType(operation: Operation) {
  const combinedOperation = operation as CombinedOperation;
  let returnValue = {
    details: {} as OperationDetails,
    type: undefined as OperationType | undefined,
  };

  Object.values(OperationType).find((type) => {
    const originalDetails = combinedOperation?.[type];
    if (originalDetails) {
      const operationDetails = { ...originalDetails } as OperationDetails;

      switch (type) {
        case OperationType.swap:
        case OperationType.evmSwap:
          operationDetails.toChainId = (originalDetails as EvmSwap).fromChainId;
          break;

        case OperationType.axelarTransfer:
          operationDetails.denomIn =
            (originalDetails as AxelarTransfer).ibcTransferToAxelar?.denomIn ??
            (originalDetails as Transfer).denomIn;
          break;

        case OperationType.bankSend: {
          const bankSend = originalDetails as BankSend;

          operationDetails.denomIn = bankSend.denom;
          operationDetails.denomOut = bankSend.denom;
          operationDetails.fromChainId = bankSend.chainId;
          operationDetails.toChainId = bankSend.chainId;

          break;
        }

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

export function getClientOperation(operation: Operation) {
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

export function getClientOperations(
  operations?: Operation[]
): ClientOperation[] {
  if (!operations) return [];
  let transferIndex = 0;
  const filteredOperations = filterNeutronSwapFee(operations);
  return filteredOperations.map((operation, index, arr) => {
    const prevOperation = arr[index - 1];

    const signRequired = (() => {
      if (index === 0) {
        return false;
      } else {
        if (prevOperation && operation.txIndex > prevOperation.txIndex) {
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

function filterNeutronSwapFee(operations: Operation[]) {
  return operations.filter((op, i) => {
    const clientOperation = getClientOperation(op);
    if (
      clientOperation.type === OperationType.swap &&
      clientOperation.swapOut?.swapVenue?.name === "neutron-astroport" &&
      clientOperation.swapOut?.swapVenue.chainId === "neutron-1" &&
      clientOperation.chainId === "neutron-1" &&
      clientOperation.denomOut === "untrn" &&
      clientOperation.fromChainId === "neutron-1" &&
      clientOperation.swapOut?.swapAmountOut === "200000"
    ) {
      const nextOperation = operations[i + 1];
      if (nextOperation) {
        const nextClientOperation = getClientOperation(nextOperation);
        if (
          nextClientOperation.type === OperationType.swap &&
          nextClientOperation.swapIn?.swapVenue?.name === "neutron-astroport" &&
          nextClientOperation.swapIn?.swapVenue?.chainId === "neutron-1" &&
          nextClientOperation.chainId === "neutron-1"
        ) {
          return false;
        }
      }
    }
    return true;
  });
}

function getClientTransferEvent(transferEvent: TransferEvent) {
  const combinedTransferEvent = transferEvent as CombinedTransferEvent;

  const axelarTransfer =
    combinedTransferEvent?.axelarTransfer as AxelarTransferInfo;
  const ibcTransfer = combinedTransferEvent?.ibcTransfer as IBCTransferInfo;
  const cctpTransfer = combinedTransferEvent?.cctpTransfer as CCTPTransferInfo;
  const hyperlaneTransfer =
    combinedTransferEvent?.hyperlaneTransfer as HyperlaneTransferInfo;
  const opInitTransfer =
    combinedTransferEvent?.opInitTransfer as OPInitTransferInfo;
  const goFastTransfer =
    combinedTransferEvent?.goFastTransfer as GoFastTransferInfo;
  const stargateTransfer =
    combinedTransferEvent?.stargateTransfer as StargateTransferInfo;
  const eurekaTransfer =
    combinedTransferEvent?.eurekaTransfer as EurekaTransferInfo;
  const layerZeroTransfer =
    combinedTransferEvent?.layerZeroTransfer as LayerZeroTransferInfo;

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
  } else if (stargateTransfer) {
    transferType = TransferType.stargateTransfer;
  } else if (eurekaTransfer) {
    transferType = TransferType.eurekaTransfer;
  } else if (layerZeroTransfer) {
    transferType = TransferType.layerZeroTransfer;
  }

  const getExplorerLink = (type: "send" | "receive") => {
    switch (transferType) {
      case TransferType.ibcTransfer:
        if (type === "send") {
          return ibcTransfer.packetTxs.sendTx?.explorerLink;
        }
        return ibcTransfer.packetTxs.receiveTx?.explorerLink;
      case TransferType.eurekaTransfer:
        if (type === "send") {
          return eurekaTransfer.packetTxs.sendTx?.explorerLink;
        }
        return eurekaTransfer.packetTxs.receiveTx?.explorerLink;
      case TransferType.goFastTransfer:
        if (type === "send") {
          return goFastTransfer.txs.orderSubmittedTx?.explorerLink;
        }
        return goFastTransfer.txs.orderFilledTx?.explorerLink;
      case TransferType.axelarTransfer:
        return axelarTransfer?.axelarScanLink;
      default:
        type RemainingTransferTypes =
          | CCTPTransferInfo
          | HyperlaneTransferInfo
          | OPInitTransferInfo
          | StargateTransferInfo
          | LayerZeroTransferInfo;

        if (type === "send") {
          return (combinedTransferEvent[transferType] as RemainingTransferTypes)
            ?.txs?.sendTx?.explorerLink;
        }
        return (combinedTransferEvent[transferType] as RemainingTransferTypes)
          ?.txs?.receiveTx?.explorerLink;
    }
  };
  const _result = {
    ...ibcTransfer,
    ...axelarTransfer,
    ...cctpTransfer,
    ...hyperlaneTransfer,
    ...stargateTransfer,
    ...hyperlaneTransfer,
    ...opInitTransfer,
    ...goFastTransfer,
    ...stargateTransfer,
    ...eurekaTransfer,
    ...layerZeroTransfer,
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
    return (txStatus.transferSequence ?? []).map((transferEvent) => {
      return getClientTransferEvent(transferEvent);
    });
  });
}

export function getSimpleOverallStatus(state: TransactionState): OverallStatus {
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
    | StargateTransferState
    | LayerZeroTransferState
): TransferEventStatus {
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
    case "STARGATE_TRANSFER_SENT":
    case "LAYER_ZERO_TRANSFER_SENT":
      return "pending";
    case "TRANSFER_SUCCESS":
    case "AXELAR_TRANSFER_SUCCESS":
    case "CCTP_TRANSFER_RECEIVED":
    case "HYPERLANE_TRANSFER_RECEIVED":
    case "OPINIT_TRANSFER_RECEIVED":
    case "STARGATE_TRANSFER_RECEIVED":
    case "GO_FAST_TRANSFER_FILLED":
    case "LAYER_ZERO_TRANSFER_RECEIVED":
      return "completed";
    default:
      return "failed";
  }
}

type CombinedTransferEvent = {
  [TransferType.ibcTransfer]: IBCTransferInfo;
  [TransferType.axelarTransfer]: AxelarTransferInfo;
  [TransferType.cctpTransfer]: CCTPTransferInfo;
  [TransferType.hyperlaneTransfer]: HyperlaneTransferInfo;
  [TransferType.opInitTransfer]: OPInitTransferInfo;
  [TransferType.goFastTransfer]: GoFastTransferInfo;
  [TransferType.stargateTransfer]: StargateTransferInfo;
  [TransferType.eurekaTransfer]: EurekaTransferInfo;
  [TransferType.layerZeroTransfer]: LayerZeroTransferInfo;
};

export enum TransferType {
  ibcTransfer = "ibcTransfer",
  axelarTransfer = "axelarTransfer",
  cctpTransfer = "cctpTransfer",
  hyperlaneTransfer = "hyperlaneTransfer",
  opInitTransfer = "opInitTransfer",
  goFastTransfer = "goFastTransfer",
  stargateTransfer = "stargateTransfer",
  eurekaTransfer = "eurekaTransfer",
  layerZeroTransfer = "layerZeroTransfer",
}

export type TransferEventStatus =
  | "unconfirmed"
  | "signing"
  | "pending"
  | "completed"
  | "failed"
  | "approving"
  | "incomplete";

export type ClientTransferEvent = {
  fromChainId: string;
  toChainId: string;
  state:
    | TransferState
    | AxelarTransferState
    | CCTPTransferState
    | HyperlaneTransferState
    | OPInitTransferState
    | GoFastTransferState
    | StargateTransferState
    | LayerZeroTransferState;
  status?: TransferEventStatus;
  fromExplorerLink?: string;
  toExplorerLink?: string;
  explorerLink?: string;
};
