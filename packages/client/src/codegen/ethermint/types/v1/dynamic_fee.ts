//@ts-nocheck
import * as _m0 from "protobufjs/minimal";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/** ExtensionOptionDynamicFeeTx is an extension option that specifies the maxPrioPrice for cosmos tx */
export interface ExtensionOptionDynamicFeeTx {
  /** max_priority_price is the same as `max_priority_fee_per_gas` in eip-1559 spec */
  maxPriorityPrice: string;
}
export interface ExtensionOptionDynamicFeeTxProtoMsg {
  typeUrl: "/ethermint.types.v1.ExtensionOptionDynamicFeeTx";
  value: Uint8Array;
}
/** ExtensionOptionDynamicFeeTx is an extension option that specifies the maxPrioPrice for cosmos tx */
export interface ExtensionOptionDynamicFeeTxAmino {
  /** max_priority_price is the same as `max_priority_fee_per_gas` in eip-1559 spec */
  max_priority_price?: string;
}
export interface ExtensionOptionDynamicFeeTxAminoMsg {
  type: "types/ExtensionOptionDynamicFeeTx";
  value: ExtensionOptionDynamicFeeTxAmino;
}
/** ExtensionOptionDynamicFeeTx is an extension option that specifies the maxPrioPrice for cosmos tx */
export interface ExtensionOptionDynamicFeeTxSDKType {
  max_priority_price: string;
}
function createBaseExtensionOptionDynamicFeeTx(): ExtensionOptionDynamicFeeTx {
  return {
    maxPriorityPrice: ""
  };
}
export const ExtensionOptionDynamicFeeTx = {
  typeUrl: "/ethermint.types.v1.ExtensionOptionDynamicFeeTx",
  encode(message: ExtensionOptionDynamicFeeTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.maxPriorityPrice !== "") {
      writer.uint32(10).string(message.maxPriorityPrice);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): ExtensionOptionDynamicFeeTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExtensionOptionDynamicFeeTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.maxPriorityPrice = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ExtensionOptionDynamicFeeTx {
    return {
      maxPriorityPrice: isSet(object.maxPriorityPrice) ? String(object.maxPriorityPrice) : ""
    };
  },
  toJSON(message: ExtensionOptionDynamicFeeTx): JsonSafe<ExtensionOptionDynamicFeeTx> {
    const obj: any = {};
    message.maxPriorityPrice !== undefined && (obj.maxPriorityPrice = message.maxPriorityPrice);
    return obj;
  },
  fromPartial(object: Partial<ExtensionOptionDynamicFeeTx>): ExtensionOptionDynamicFeeTx {
    const message = createBaseExtensionOptionDynamicFeeTx();
    message.maxPriorityPrice = object.maxPriorityPrice ?? "";
    return message;
  },
  fromAmino(object: ExtensionOptionDynamicFeeTxAmino): ExtensionOptionDynamicFeeTx {
    const message = createBaseExtensionOptionDynamicFeeTx();
    if (object.max_priority_price !== undefined && object.max_priority_price !== null) {
      message.maxPriorityPrice = object.max_priority_price;
    }
    return message;
  },
  toAmino(message: ExtensionOptionDynamicFeeTx): ExtensionOptionDynamicFeeTxAmino {
    const obj: any = {};
    obj.max_priority_price = message.maxPriorityPrice === "" ? undefined : message.maxPriorityPrice;
    return obj;
  },
  fromAminoMsg(object: ExtensionOptionDynamicFeeTxAminoMsg): ExtensionOptionDynamicFeeTx {
    return ExtensionOptionDynamicFeeTx.fromAmino(object.value);
  },
  toAminoMsg(message: ExtensionOptionDynamicFeeTx): ExtensionOptionDynamicFeeTxAminoMsg {
    return {
      type: "types/ExtensionOptionDynamicFeeTx",
      value: ExtensionOptionDynamicFeeTx.toAmino(message)
    };
  },
  fromProtoMsg(message: ExtensionOptionDynamicFeeTxProtoMsg): ExtensionOptionDynamicFeeTx {
    return ExtensionOptionDynamicFeeTx.decode(message.value);
  },
  toProto(message: ExtensionOptionDynamicFeeTx): Uint8Array {
    return ExtensionOptionDynamicFeeTx.encode(message).finish();
  },
  toProtoMsg(message: ExtensionOptionDynamicFeeTx): ExtensionOptionDynamicFeeTxProtoMsg {
    return {
      typeUrl: "/ethermint.types.v1.ExtensionOptionDynamicFeeTx",
      value: ExtensionOptionDynamicFeeTx.encode(message).finish()
    };
  }
};