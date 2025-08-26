import {
  AxelarTransfer,
  BankSend,
  CCTPTransfer,
  EurekaTransfer,
  EvmSwap,
  GoFastTransfer,
  HyperlaneTransfer,
  Operation,
  OPInitTransfer,
  StargateTransfer,
  Swap,
  SwapExactCoinIn,
  SwapExactCoinOut,
  LayerZeroTransfer,
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

export function getClientOperations(operations?: Operation[]): ClientOperation[] {
  if (!operations) return [];
  let transferIndex = 0;
  const filteredOperations = filterNeutronSwapFee(operations);
  return filteredOperations.map((operation, index, arr) => {
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
      clientOperation.type === OperationType.swap || clientOperation.type === OperationType.evmSwap;
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
          nextClientOperation.chainId === "neutron-1"
        ) {
          return false;
        }
      }
    }
    return true;
  });
}
