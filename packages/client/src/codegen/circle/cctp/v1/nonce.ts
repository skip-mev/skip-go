//@ts-nocheck
import { Long, isSet } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/**
 * The Nonce type functions both to mark receipt of received messages and a
 * counter for sending messages
 * @param source_domain the domain id, used to mark used nonces for received
 * messages
 * @param nonce the nonce number
 */
export interface Nonce {
  sourceDomain: number;
  nonce: Long;
}
export interface NonceProtoMsg {
  typeUrl: "/circle.cctp.v1.Nonce";
  value: Uint8Array;
}
/**
 * The Nonce type functions both to mark receipt of received messages and a
 * counter for sending messages
 * @param source_domain the domain id, used to mark used nonces for received
 * messages
 * @param nonce the nonce number
 */
export interface NonceAmino {
  source_domain?: number;
  nonce?: string;
}
export interface NonceAminoMsg {
  type: "/circle.cctp.v1.Nonce";
  value: NonceAmino;
}
/**
 * The Nonce type functions both to mark receipt of received messages and a
 * counter for sending messages
 * @param source_domain the domain id, used to mark used nonces for received
 * messages
 * @param nonce the nonce number
 */
export interface NonceSDKType {
  source_domain: number;
  nonce: Long;
}
function createBaseNonce(): Nonce {
  return {
    sourceDomain: 0,
    nonce: Long.UZERO
  };
}
export const Nonce = {
  typeUrl: "/circle.cctp.v1.Nonce",
  encode(message: Nonce, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sourceDomain !== 0) {
      writer.uint32(8).uint32(message.sourceDomain);
    }
    if (!message.nonce.isZero()) {
      writer.uint32(16).uint64(message.nonce);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Nonce {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNonce();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sourceDomain = reader.uint32();
          break;
        case 2:
          message.nonce = (reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Nonce {
    return {
      sourceDomain: isSet(object.sourceDomain) ? Number(object.sourceDomain) : 0,
      nonce: isSet(object.nonce) ? Long.fromValue(object.nonce) : Long.UZERO
    };
  },
  toJSON(message: Nonce): JsonSafe<Nonce> {
    const obj: any = {};
    message.sourceDomain !== undefined && (obj.sourceDomain = Math.round(message.sourceDomain));
    message.nonce !== undefined && (obj.nonce = (message.nonce || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<Nonce>): Nonce {
    const message = createBaseNonce();
    message.sourceDomain = object.sourceDomain ?? 0;
    message.nonce = object.nonce !== undefined && object.nonce !== null ? Long.fromValue(object.nonce) : Long.UZERO;
    return message;
  },
  fromAmino(object: NonceAmino): Nonce {
    const message = createBaseNonce();
    if (object.source_domain !== undefined && object.source_domain !== null) {
      message.sourceDomain = object.source_domain;
    }
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = Long.fromString(object.nonce);
    }
    return message;
  },
  toAmino(message: Nonce): NonceAmino {
    const obj: any = {};
    obj.source_domain = message.sourceDomain === 0 ? undefined : message.sourceDomain;
    obj.nonce = !message.nonce.isZero() ? message.nonce.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: NonceAminoMsg): Nonce {
    return Nonce.fromAmino(object.value);
  },
  fromProtoMsg(message: NonceProtoMsg): Nonce {
    return Nonce.decode(message.value);
  },
  toProto(message: Nonce): Uint8Array {
    return Nonce.encode(message).finish();
  },
  toProtoMsg(message: Nonce): NonceProtoMsg {
    return {
      typeUrl: "/circle.cctp.v1.Nonce",
      value: Nonce.encode(message).finish()
    };
  }
};