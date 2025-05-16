//@ts-nocheck
import { Long, isSet, padDecimal } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { Decimal } from "@cosmjs/math";
import { JsonSafe } from "../../../json-safe";
/** Params defines the parameters for the compute module. */
export interface Params {
  /**
   * CompileCost is how much SDK gas we charge *per byte* for compiling WASM
   * code.
   */
  compileCost: string;
  /** MaxContractSize is the maximum size of contract to store in bytes. */
  maxContractSize: Long;
}
export interface ParamsProtoMsg {
  typeUrl: "/secret.compute.v1beta1.Params";
  value: Uint8Array;
}
/** Params defines the parameters for the compute module. */
export interface ParamsAmino {
  /**
   * CompileCost is how much SDK gas we charge *per byte* for compiling WASM
   * code.
   */
  compile_cost: string;
  /** MaxContractSize is the maximum size of contract to store in bytes. */
  max_contract_size: string;
}
export interface ParamsAminoMsg {
  type: "/secret.compute.v1beta1.Params";
  value: ParamsAmino;
}
/** Params defines the parameters for the compute module. */
export interface ParamsSDKType {
  compile_cost: string;
  max_contract_size: Long;
}
function createBaseParams(): Params {
  return {
    compileCost: "",
    maxContractSize: Long.UZERO
  };
}
export const Params = {
  typeUrl: "/secret.compute.v1beta1.Params",
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.compileCost !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.compileCost, 18).atomics);
    }
    if (!message.maxContractSize.isZero()) {
      writer.uint32(16).uint64(message.maxContractSize);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.compileCost = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 2:
          message.maxContractSize = (reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Params {
    return {
      compileCost: isSet(object.compileCost) ? String(object.compileCost) : "",
      maxContractSize: isSet(object.maxContractSize) ? Long.fromValue(object.maxContractSize) : Long.UZERO
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.compileCost !== undefined && (obj.compileCost = message.compileCost);
    message.maxContractSize !== undefined && (obj.maxContractSize = (message.maxContractSize || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.compileCost = object.compileCost ?? "";
    message.maxContractSize = object.maxContractSize !== undefined && object.maxContractSize !== null ? Long.fromValue(object.maxContractSize) : Long.UZERO;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.compile_cost !== undefined && object.compile_cost !== null) {
      message.compileCost = object.compile_cost;
    }
    if (object.max_contract_size !== undefined && object.max_contract_size !== null) {
      message.maxContractSize = Long.fromString(object.max_contract_size);
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.compile_cost = padDecimal(message.compileCost) ?? "";
    obj.max_contract_size = message.maxContractSize ? message.maxContractSize.toString() : "0";
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/secret.compute.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};