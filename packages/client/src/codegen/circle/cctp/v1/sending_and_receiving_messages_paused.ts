//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * Message format for SendingAndReceivingMessagesPaused
 * @param paused true if paused, false if not paused
 */
export interface SendingAndReceivingMessagesPaused {
  paused: boolean;
}
export interface SendingAndReceivingMessagesPausedProtoMsg {
  typeUrl: "/circle.cctp.v1.SendingAndReceivingMessagesPaused";
  value: Uint8Array;
}
/**
 * Message format for SendingAndReceivingMessagesPaused
 * @param paused true if paused, false if not paused
 * @name SendingAndReceivingMessagesPausedAmino
 * @package circle.cctp.v1
 * @see proto type: circle.cctp.v1.SendingAndReceivingMessagesPaused
 */
export interface SendingAndReceivingMessagesPausedAmino {
  paused?: boolean;
}
export interface SendingAndReceivingMessagesPausedAminoMsg {
  type: "/circle.cctp.v1.SendingAndReceivingMessagesPaused";
  value: SendingAndReceivingMessagesPausedAmino;
}
/**
 * Message format for SendingAndReceivingMessagesPaused
 * @param paused true if paused, false if not paused
 */
export interface SendingAndReceivingMessagesPausedSDKType {
  paused: boolean;
}
function createBaseSendingAndReceivingMessagesPaused(): SendingAndReceivingMessagesPaused {
  return {
    paused: false
  };
}
export const SendingAndReceivingMessagesPaused = {
  typeUrl: "/circle.cctp.v1.SendingAndReceivingMessagesPaused",
  encode(message: SendingAndReceivingMessagesPaused, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.paused === true) {
      writer.uint32(8).bool(message.paused);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): SendingAndReceivingMessagesPaused {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendingAndReceivingMessagesPaused();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.paused = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SendingAndReceivingMessagesPaused {
    return {
      paused: isSet(object.paused) ? Boolean(object.paused) : false
    };
  },
  toJSON(message: SendingAndReceivingMessagesPaused): JsonSafe<SendingAndReceivingMessagesPaused> {
    const obj: any = {};
    message.paused !== undefined && (obj.paused = message.paused);
    return obj;
  },
  fromPartial(object: Partial<SendingAndReceivingMessagesPaused>): SendingAndReceivingMessagesPaused {
    const message = createBaseSendingAndReceivingMessagesPaused();
    message.paused = object.paused ?? false;
    return message;
  },
  fromAmino(object: SendingAndReceivingMessagesPausedAmino): SendingAndReceivingMessagesPaused {
    const message = createBaseSendingAndReceivingMessagesPaused();
    if (object.paused !== undefined && object.paused !== null) {
      message.paused = object.paused;
    }
    return message;
  },
  toAmino(message: SendingAndReceivingMessagesPaused): SendingAndReceivingMessagesPausedAmino {
    const obj: any = {};
    obj.paused = message.paused === false ? undefined : message.paused;
    return obj;
  },
  fromAminoMsg(object: SendingAndReceivingMessagesPausedAminoMsg): SendingAndReceivingMessagesPaused {
    return SendingAndReceivingMessagesPaused.fromAmino(object.value);
  },
  fromProtoMsg(message: SendingAndReceivingMessagesPausedProtoMsg): SendingAndReceivingMessagesPaused {
    return SendingAndReceivingMessagesPaused.decode(message.value);
  },
  toProto(message: SendingAndReceivingMessagesPaused): Uint8Array {
    return SendingAndReceivingMessagesPaused.encode(message).finish();
  },
  toProtoMsg(message: SendingAndReceivingMessagesPaused): SendingAndReceivingMessagesPausedProtoMsg {
    return {
      typeUrl: "/circle.cctp.v1.SendingAndReceivingMessagesPaused",
      value: SendingAndReceivingMessagesPaused.encode(message).finish()
    };
  }
};