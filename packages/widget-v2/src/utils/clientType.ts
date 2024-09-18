import {
  AxelarTransfer,
  BankSend,
  CCTPTransfer,
  EvmSwap,
  HyperlaneTransfer,
  OPInitTransfer,
  Operation as SkipClientOperation,
  Swap,
  SwapVenue,
  Transfer,
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
