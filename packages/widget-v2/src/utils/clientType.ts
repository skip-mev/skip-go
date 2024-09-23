import {
  AxelarTransfer,
  AxelarTransferInfo,
  BankSend,
  CCTPTransfer,
  CCTPTransferInfo,
  EvmSwap,
  HyperlaneTransfer,
  HyperlaneTransferInfo,
  OPInitTransfer,
  OPInitTransferInfo,
  Operation as SkipClientOperation,
  Swap,
  SwapVenue,
  Transfer,
  TransferEvent,
  TransferInfo,
  TransferState,
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
        case OperationType.evmSwap:
          (operationDetails as Transfer).toChainID = (operationDetails as EvmSwap).fromChainID;
          break;
        case OperationType.bankSend:
          (operationDetails as Transfer).denomIn = (operationDetails as BankSend).denom;
          (operationDetails as Transfer).denomOut = (operationDetails as BankSend).denom;
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

  const axelarTransfer = combinedTransferEvent?.axelarTransfer as AxelarTransferInfo;
  const ibcTransfer = combinedTransferEvent?.ibcTransfer as TransferInfo;
  const cctpTransfer = combinedTransferEvent?.cctpTransfer as CCTPTransferInfo;
  const hyperlaneTransfer = combinedTransferEvent?.hyperlaneTransfer as HyperlaneTransferInfo;
  const opInitTransfer = combinedTransferEvent?.opInitTransfer as OPInitTransferInfo;

  return {
    ...ibcTransfer,
    ...axelarTransfer,
    ...cctpTransfer,
    ...hyperlaneTransfer,
    ...opInitTransfer,
  };
}

export function getClientTransferEventArray(transferEventArray: TransferEvent[]) {
  return transferEventArray.map((transferEvent) => getClientTransferEvent(transferEvent));
}

type CombinedTransferEvent = {
  ibcTransfer: TransferInfo;
  axelarTransfer: AxelarTransferInfo;
  cctpTransfer: CCTPTransferInfo;
  hyperlaneTransfer: HyperlaneTransferInfo;
  opInitTransfer: OPInitTransferInfo;
};

type ClientTransferEvent = CombineObjectTypes<
  TransferInfo &
  AxelarTransferInfo &
  CCTPTransferInfo &
  HyperlaneTransferInfo &
  OPInitTransferInfo
>;

// type TxStatusResponse = {
//   status: StatusState;
//   transferSequence: TransferEvent[];
//   nextBlockingTransfer: NextBlockingTransfer | null;
//   transferAssetRelease: TransferAssetRelease | null;
//   error: StatusError | null;
//   state: StatusState;
//   transfers: TransferStatus[];
// };