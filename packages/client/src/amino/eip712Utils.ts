// Source: https://github.com/chainapsis/keplr-wallet/blob/400fa35fef6143154e301ab4bd1aa8a847ab4e7f/packages/stores/src/account/utils.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { EthermintChainIdHelper } from "@keplr-wallet/cosmos";
import { Any } from "@keplr-wallet/proto-types/google/protobuf/any";
import { Dec } from "@keplr-wallet/unit";
import {
  BroadcastMode,
  Keplr,
  KeplrSignOptions,
  Msg,
  StdFee,
} from "@keplr-wallet/types";
import { ETH_KEY_SIGN_CHAINS, ETH_SIGN_PLAIN_JSON } from "./ethKeySign";

export type ProtoMsgsOrWithAminoMsgs = {
  aminoMsgs?: Msg[];
  protoMsgs: Any[];

  // Add rlp types data if you need to support ethermint with ledger.
  // Must include `MsgValue`.
  rlpTypes?: Record<
    string,
    Array<{
      name: string;
      type: string;
    }>
  >;
};

export interface KeplrSignOptionsWithAltSignMethods extends KeplrSignOptions {
  readonly signAmino?: Keplr["signAmino"];
  readonly signDirect?: Keplr["signDirect"];
  readonly experimentalSignEIP712CosmosTx_v0?: Keplr["experimentalSignEIP712CosmosTx_v0"];
  readonly sendTx?: (
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode,
  ) => Promise<Uint8Array>;
}

export interface MakeTxResponse {
  ui: {
    type(): string;
    overrideType(type: string): void;
  };
  msgs(): Promise<ProtoMsgsOrWithAminoMsgs>;
  simulate(
    fee?: Partial<Omit<StdFee, "gas">>,
    memo?: string,
  ): Promise<{
    gasUsed: number;
  }>;
  simulateAndSend(
    feeOptions: {
      gasAdjustment: number;
      gasPrice?: {
        denom: string;
        amount: Dec;
      };
    },
    memo?: string,
    signOptions?: KeplrSignOptionsWithAltSignMethods,
    onTxEvents?:
      | ((tx: any) => void)
      | {
          onBroadcasted?: (txHash: Uint8Array) => void;
          onFulfill?: (tx: any) => void;
        },
  ): Promise<void>;
  send(
    fee: StdFee,
    memo?: string,
    signOptions?: KeplrSignOptionsWithAltSignMethods,
    onTxEvents?:
      | ((tx: any) => void)
      | {
          onBroadcasted?: (txHash: Uint8Array) => void;
          onFulfill?: (tx: any) => void;
        },
  ): Promise<void>;
  sendWithGasPrice(
    gasInfo: {
      gas: number;
      gasPrice?: {
        denom: string;
        amount: Dec;
      };
    },
    memo?: string,
    signOptions?: KeplrSignOptionsWithAltSignMethods,
    onTxEvents?:
      | ((tx: any) => void)
      | {
          onBroadcasted?: (txHash: Uint8Array) => void;
          onFulfill?: (tx: any) => void;
        },
  ): Promise<void>;
}

export function txEventsWithPreOnFulfill(
  onTxEvents:
    | ((tx: any) => void)
    | {
        onBroadcasted?: (txHash: Uint8Array) => void;
        onFulfill?: (tx: any) => void;
      }
    | undefined,
  preOnTxEvents:
    | ((tx: any) => void)
    | {
        onBroadcastFailed?: (e?: Error) => void;
        onBroadcasted?: (txHash: Uint8Array) => void;
        onFulfill?: (tx: any) => void;
      }
    | undefined,
):
  | {
      onBroadcastFailed?: (e?: Error) => void;
      onBroadcasted?: (txHash: Uint8Array) => void;
      onFulfill?: (tx: any) => void;
    }
  | undefined {
  const onBroadcasted = onTxEvents
    ? typeof onTxEvents === "function"
      ? undefined
      : onTxEvents.onBroadcasted
    : undefined;
  const onFulfill = onTxEvents
    ? typeof onTxEvents === "function"
      ? onTxEvents
      : onTxEvents.onFulfill
    : undefined;

  const onPreBroadcasted = preOnTxEvents
    ? typeof preOnTxEvents === "function"
      ? undefined
      : preOnTxEvents.onBroadcasted
    : undefined;
  const onPreFulfill = preOnTxEvents
    ? typeof preOnTxEvents === "function"
      ? preOnTxEvents
      : preOnTxEvents.onFulfill
    : undefined;

  return {
    onBroadcastFailed:
      typeof preOnTxEvents === "function"
        ? undefined
        : preOnTxEvents?.onBroadcastFailed,
    onBroadcasted:
      onBroadcasted || onPreBroadcasted
        ? (txHash: Uint8Array) => {
            if (onPreBroadcasted) {
              onPreBroadcasted(txHash);
            }

            if (onBroadcasted) {
              onBroadcasted(txHash);
            }
          }
        : undefined,
    onFulfill:
      onFulfill || onPreFulfill
        ? (tx: any) => {
            if (onPreFulfill) {
              onPreFulfill(tx);
            }

            if (onFulfill) {
              onFulfill(tx);
            }
          }
        : undefined,
  };
}

export const getEip712TypedDataBasedOnChainId = (
  chainId: string,
  rlpTypes: Record<
    string,
    Array<{
      name: string;
      type: string;
    }>
  >,
): {
  types: Record<string, { name: string; type: string }[] | undefined>;
  domain: Record<string, any>;
  primaryType: string;
} => {
  const chainIsInjective = chainId.startsWith("injective");
  const signPlainJSON =
    ETH_KEY_SIGN_CHAINS.includes(chainId) &&
    ETH_SIGN_PLAIN_JSON.includes(chainId);

  const types = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        // XXX: Maybe, non-standard format?
        { name: "verifyingContract", type: "string" },
        // XXX: Maybe, non-standard format?
        { name: "salt", type: "string" },
      ],
      Tx: [
        { name: "account_number", type: "string" },
        { name: "chain_id", type: "string" },
        { name: "fee", type: "Fee" },
        { name: "memo", type: "string" },
        { name: "msgs", type: "Msg[]" },
        { name: "sequence", type: "string" },
      ],
      Fee: [
        ...(signPlainJSON ? [] : [{ name: "feePayer", type: "string" }]),
        { name: "amount", type: "Coin[]" },
        { name: "gas", type: "string" },
      ],
      Coin: [
        { name: "denom", type: "string" },
        { name: "amount", type: "string" },
      ],
      Msg: [
        { name: "type", type: "string" },
        { name: "value", type: "MsgValue" },
      ],
      ...rlpTypes,
    },
    domain: {
      name: "Cosmos Web3",
      version: "1.0.0",
      chainId: signPlainJSON
        ? 9999
        : EthermintChainIdHelper.parse(chainId).ethChainId.toString(),
      verifyingContract: "cosmos",
      salt: "0",
    },
    primaryType: "Tx",
  };

  // Injective doesn't need feePayer to be included but requires
  // timeout_height in the types
  if (chainIsInjective) {
    types.types.Tx = [
      ...types.types.Tx,
      { name: "timeout_height", type: "string" },
    ];
    types.domain.name = "Injective Web3";
    types.domain.chainId =
      "0x" + EthermintChainIdHelper.parse(chainId).ethChainId.toString(16);
    types.types.Fee = [
      { name: "amount", type: "Coin[]" },
      { name: "gas", type: "string" },
    ];

    return types;
  }

  return types;
};
