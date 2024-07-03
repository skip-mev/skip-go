//@ts-nocheck
import { Params, ParamsAmino, ParamsSDKType } from "./feemarket";
import { Long, isSet } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
import { JsonSafe } from "../../../json-safe";
/** GenesisState defines the feemarket module's genesis state. */
export interface GenesisState {
  /** params defines all the parameters of the feemarket module. */
  params: Params;
  /**
   * block_gas is the amount of gas wanted on the last block before the upgrade.
   * Zero by default.
   */
  blockGas: Long;
}
export interface GenesisStateProtoMsg {
  typeUrl: "/ethermint.feemarket.v1.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines the feemarket module's genesis state. */
export interface GenesisStateAmino {
  /** params defines all the parameters of the feemarket module. */
  params?: ParamsAmino;
  /**
   * block_gas is the amount of gas wanted on the last block before the upgrade.
   * Zero by default.
   */
  block_gas?: string;
}
export interface GenesisStateAminoMsg {
  type: "feemarket/GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the feemarket module's genesis state. */
export interface GenesisStateSDKType {
  params: ParamsSDKType;
  block_gas: Long;
}
function createBaseGenesisState(): GenesisState {
  return {
    params: Params.fromPartial({}),
    blockGas: Long.UZERO
  };
}
export const GenesisState = {
  typeUrl: "/ethermint.feemarket.v1.GenesisState",
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (!message.blockGas.isZero()) {
      writer.uint32(24).uint64(message.blockGas);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 3:
          message.blockGas = (reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      blockGas: isSet(object.blockGas) ? Long.fromValue(object.blockGas) : Long.UZERO
    };
  },
  toJSON(message: GenesisState): JsonSafe<GenesisState> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.blockGas !== undefined && (obj.blockGas = (message.blockGas || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.blockGas = object.blockGas !== undefined && object.blockGas !== null ? Long.fromValue(object.blockGas) : Long.UZERO;
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    if (object.block_gas !== undefined && object.block_gas !== null) {
      message.blockGas = Long.fromString(object.block_gas);
    }
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    obj.block_gas = !message.blockGas.isZero() ? message.blockGas.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  toAminoMsg(message: GenesisState): GenesisStateAminoMsg {
    return {
      type: "feemarket/GenesisState",
      value: GenesisState.toAmino(message)
    };
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/ethermint.feemarket.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};