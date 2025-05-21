//@ts-nocheck
import { Long, isSet } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/**
 * Message format for BurningAndMintingPaused
 * @param paused true if paused, false if not paused
 */
export interface MaxMessageBodySize {
  amount: Long;
}
export interface MaxMessageBodySizeProtoMsg {
  typeUrl: "/circle.cctp.v1.MaxMessageBodySize";
  value: Uint8Array;
}
/**
 * Message format for BurningAndMintingPaused
 * @param paused true if paused, false if not paused
 */
export interface MaxMessageBodySizeAmino {
  amount?: string;
}
export interface MaxMessageBodySizeAminoMsg {
  type: "/circle.cctp.v1.MaxMessageBodySize";
  value: MaxMessageBodySizeAmino;
}
/**
 * Message format for BurningAndMintingPaused
 * @param paused true if paused, false if not paused
 */
export interface MaxMessageBodySizeSDKType {
  amount: Long;
}
function createBaseMaxMessageBodySize(): MaxMessageBodySize {
  return {
    amount: Long.UZERO
  };
}
export const MaxMessageBodySize = {
  typeUrl: "/circle.cctp.v1.MaxMessageBodySize",
  encode(message: MaxMessageBodySize, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.amount.isZero()) {
      writer.uint32(8).uint64(message.amount);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MaxMessageBodySize {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMaxMessageBodySize();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = (reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MaxMessageBodySize {
    return {
      amount: isSet(object.amount) ? Long.fromValue(object.amount) : Long.UZERO
    };
  },
  toJSON(message: MaxMessageBodySize): JsonSafe<MaxMessageBodySize> {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = (message.amount || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<MaxMessageBodySize>): MaxMessageBodySize {
    const message = createBaseMaxMessageBodySize();
    message.amount = object.amount !== undefined && object.amount !== null ? Long.fromValue(object.amount) : Long.UZERO;
    return message;
  },
  fromAmino(object: MaxMessageBodySizeAmino): MaxMessageBodySize {
    const message = createBaseMaxMessageBodySize();
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Long.fromString(object.amount);
    }
    return message;
  },
  toAmino(message: MaxMessageBodySize): MaxMessageBodySizeAmino {
    const obj: any = {};
    obj.amount = !message.amount.isZero() ? message.amount.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MaxMessageBodySizeAminoMsg): MaxMessageBodySize {
    return MaxMessageBodySize.fromAmino(object.value);
  },
  fromProtoMsg(message: MaxMessageBodySizeProtoMsg): MaxMessageBodySize {
    return MaxMessageBodySize.decode(message.value);
  },
  toProto(message: MaxMessageBodySize): Uint8Array {
    return MaxMessageBodySize.encode(message).finish();
  },
  toProtoMsg(message: MaxMessageBodySize): MaxMessageBodySizeProtoMsg {
    return {
      typeUrl: "/circle.cctp.v1.MaxMessageBodySize",
      value: MaxMessageBodySize.encode(message).finish()
    };
  }
};