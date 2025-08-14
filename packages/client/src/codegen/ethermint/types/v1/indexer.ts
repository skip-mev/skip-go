//@ts-nocheck
import { Long, isSet } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/** TxResult is the value stored in eth tx indexer */
export interface TxResult {
  /** height of the blockchain */
  height: Long;
  /** tx_index of the cosmos transaction */
  txIndex: number;
  /** msg_index in a batch transaction */
  msgIndex: number;
  /**
   * eth_tx_index is the index in the list of valid eth tx in the block,
   * aka. the transaction list returned by eth_getBlock api.
   */
  ethTxIndex: number;
  /** failed is true if the eth transaction did not go succeed */
  failed: boolean;
  /**
   * gas_used by the transaction. If it exceeds the block gas limit,
   * it's set to gas limit, which is what's actually deducted by ante handler.
   */
  gasUsed: Long;
  /**
   * cumulative_gas_used specifies the cumulated amount of gas used for all
   * processed messages within the current batch transaction.
   */
  cumulativeGasUsed: Long;
}
export interface TxResultProtoMsg {
  typeUrl: "/ethermint.types.v1.TxResult";
  value: Uint8Array;
}
/** TxResult is the value stored in eth tx indexer */
export interface TxResultAmino {
  /** height of the blockchain */
  height?: string;
  /** tx_index of the cosmos transaction */
  tx_index?: number;
  /** msg_index in a batch transaction */
  msg_index?: number;
  /**
   * eth_tx_index is the index in the list of valid eth tx in the block,
   * aka. the transaction list returned by eth_getBlock api.
   */
  eth_tx_index?: number;
  /** failed is true if the eth transaction did not go succeed */
  failed?: boolean;
  /**
   * gas_used by the transaction. If it exceeds the block gas limit,
   * it's set to gas limit, which is what's actually deducted by ante handler.
   */
  gas_used?: string;
  /**
   * cumulative_gas_used specifies the cumulated amount of gas used for all
   * processed messages within the current batch transaction.
   */
  cumulative_gas_used?: string;
}
export interface TxResultAminoMsg {
  type: "types/TxResult";
  value: TxResultAmino;
}
/** TxResult is the value stored in eth tx indexer */
export interface TxResultSDKType {
  height: Long;
  tx_index: number;
  msg_index: number;
  eth_tx_index: number;
  failed: boolean;
  gas_used: Long;
  cumulative_gas_used: Long;
}
function createBaseTxResult(): TxResult {
  return {
    height: Long.ZERO,
    txIndex: 0,
    msgIndex: 0,
    ethTxIndex: 0,
    failed: false,
    gasUsed: Long.UZERO,
    cumulativeGasUsed: Long.UZERO
  };
}
export const TxResult = {
  typeUrl: "/ethermint.types.v1.TxResult",
  encode(message: TxResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.height.isZero()) {
      writer.uint32(8).int64(message.height);
    }
    if (message.txIndex !== 0) {
      writer.uint32(16).uint32(message.txIndex);
    }
    if (message.msgIndex !== 0) {
      writer.uint32(24).uint32(message.msgIndex);
    }
    if (message.ethTxIndex !== 0) {
      writer.uint32(32).int32(message.ethTxIndex);
    }
    if (message.failed === true) {
      writer.uint32(40).bool(message.failed);
    }
    if (!message.gasUsed.isZero()) {
      writer.uint32(48).uint64(message.gasUsed);
    }
    if (!message.cumulativeGasUsed.isZero()) {
      writer.uint32(56).uint64(message.cumulativeGasUsed);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): TxResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTxResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.height = reader.int64() as Long;
          break;
        case 2:
          message.txIndex = reader.uint32();
          break;
        case 3:
          message.msgIndex = reader.uint32();
          break;
        case 4:
          message.ethTxIndex = reader.int32();
          break;
        case 5:
          message.failed = reader.bool();
          break;
        case 6:
          message.gasUsed = reader.uint64() as Long;
          break;
        case 7:
          message.cumulativeGasUsed = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TxResult {
    return {
      height: isSet(object.height) ? Long.fromValue(object.height) : Long.ZERO,
      txIndex: isSet(object.txIndex) ? Number(object.txIndex) : 0,
      msgIndex: isSet(object.msgIndex) ? Number(object.msgIndex) : 0,
      ethTxIndex: isSet(object.ethTxIndex) ? Number(object.ethTxIndex) : 0,
      failed: isSet(object.failed) ? Boolean(object.failed) : false,
      gasUsed: isSet(object.gasUsed) ? Long.fromValue(object.gasUsed) : Long.UZERO,
      cumulativeGasUsed: isSet(object.cumulativeGasUsed) ? Long.fromValue(object.cumulativeGasUsed) : Long.UZERO
    };
  },
  toJSON(message: TxResult): JsonSafe<TxResult> {
    const obj: any = {};
    message.height !== undefined && (obj.height = (message.height || Long.ZERO).toString());
    message.txIndex !== undefined && (obj.txIndex = Math.round(message.txIndex));
    message.msgIndex !== undefined && (obj.msgIndex = Math.round(message.msgIndex));
    message.ethTxIndex !== undefined && (obj.ethTxIndex = Math.round(message.ethTxIndex));
    message.failed !== undefined && (obj.failed = message.failed);
    message.gasUsed !== undefined && (obj.gasUsed = (message.gasUsed || Long.UZERO).toString());
    message.cumulativeGasUsed !== undefined && (obj.cumulativeGasUsed = (message.cumulativeGasUsed || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<TxResult>): TxResult {
    const message = createBaseTxResult();
    message.height = object.height !== undefined && object.height !== null ? Long.fromValue(object.height) : Long.ZERO;
    message.txIndex = object.txIndex ?? 0;
    message.msgIndex = object.msgIndex ?? 0;
    message.ethTxIndex = object.ethTxIndex ?? 0;
    message.failed = object.failed ?? false;
    message.gasUsed = object.gasUsed !== undefined && object.gasUsed !== null ? Long.fromValue(object.gasUsed) : Long.UZERO;
    message.cumulativeGasUsed = object.cumulativeGasUsed !== undefined && object.cumulativeGasUsed !== null ? Long.fromValue(object.cumulativeGasUsed) : Long.UZERO;
    return message;
  },
  fromAmino(object: TxResultAmino): TxResult {
    const message = createBaseTxResult();
    if (object.height !== undefined && object.height !== null) {
      message.height = Long.fromString(object.height);
    }
    if (object.tx_index !== undefined && object.tx_index !== null) {
      message.txIndex = object.tx_index;
    }
    if (object.msg_index !== undefined && object.msg_index !== null) {
      message.msgIndex = object.msg_index;
    }
    if (object.eth_tx_index !== undefined && object.eth_tx_index !== null) {
      message.ethTxIndex = object.eth_tx_index;
    }
    if (object.failed !== undefined && object.failed !== null) {
      message.failed = object.failed;
    }
    if (object.gas_used !== undefined && object.gas_used !== null) {
      message.gasUsed = Long.fromString(object.gas_used);
    }
    if (object.cumulative_gas_used !== undefined && object.cumulative_gas_used !== null) {
      message.cumulativeGasUsed = Long.fromString(object.cumulative_gas_used);
    }
    return message;
  },
  toAmino(message: TxResult): TxResultAmino {
    const obj: any = {};
    obj.height = !message.height.isZero() ? message.height.toString() : undefined;
    obj.tx_index = message.txIndex === 0 ? undefined : message.txIndex;
    obj.msg_index = message.msgIndex === 0 ? undefined : message.msgIndex;
    obj.eth_tx_index = message.ethTxIndex === 0 ? undefined : message.ethTxIndex;
    obj.failed = message.failed === false ? undefined : message.failed;
    obj.gas_used = !message.gasUsed.isZero() ? message.gasUsed.toString() : undefined;
    obj.cumulative_gas_used = !message.cumulativeGasUsed.isZero() ? message.cumulativeGasUsed.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: TxResultAminoMsg): TxResult {
    return TxResult.fromAmino(object.value);
  },
  toAminoMsg(message: TxResult): TxResultAminoMsg {
    return {
      type: "types/TxResult",
      value: TxResult.toAmino(message)
    };
  },
  fromProtoMsg(message: TxResultProtoMsg): TxResult {
    return TxResult.decode(message.value);
  },
  toProto(message: TxResult): Uint8Array {
    return TxResult.encode(message).finish();
  },
  toProtoMsg(message: TxResult): TxResultProtoMsg {
    return {
      typeUrl: "/ethermint.types.v1.TxResult",
      value: TxResult.encode(message).finish()
    };
  }
};