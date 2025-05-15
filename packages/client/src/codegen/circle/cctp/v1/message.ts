//@ts-nocheck
import { Long, isSet, bytesFromBase64, base64FromBytes } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/**
 * Generic message header for all messages passing through CCTP
 * The message body is dynamically-sized to support custom message body
 * formats. Other fields must be fixed-size to avoid hash collisions.
 * 
 * Padding: uintNN fields are left-padded, and bytesNN fields are right-padded.
 * 
 * @param version the version of the message format
 * @param source_domain domain of home chain
 * @param destination_domain domain of destination chain
 * @param nonce destination-specific nonce
 * @param sender address of sender on source chain as bytes32
 * @param recipient address of recipient on destination chain as bytes32
 * @param destination_caller address of caller on destination chain as bytes32
 * @param message_body raw bytes of message body
 */
export interface Message {
  version: number;
  sourceDomain: number;
  destinationDomain: number;
  nonce: Long;
  sender: Uint8Array;
  recipient: Uint8Array;
  destinationCaller: Uint8Array;
  messageBody: Uint8Array;
}
export interface MessageProtoMsg {
  typeUrl: "/circle.cctp.v1.Message";
  value: Uint8Array;
}
/**
 * Generic message header for all messages passing through CCTP
 * The message body is dynamically-sized to support custom message body
 * formats. Other fields must be fixed-size to avoid hash collisions.
 * 
 * Padding: uintNN fields are left-padded, and bytesNN fields are right-padded.
 * 
 * @param version the version of the message format
 * @param source_domain domain of home chain
 * @param destination_domain domain of destination chain
 * @param nonce destination-specific nonce
 * @param sender address of sender on source chain as bytes32
 * @param recipient address of recipient on destination chain as bytes32
 * @param destination_caller address of caller on destination chain as bytes32
 * @param message_body raw bytes of message body
 */
export interface MessageAmino {
  version?: number;
  source_domain?: number;
  destination_domain?: number;
  nonce?: string;
  sender?: string;
  recipient?: string;
  destination_caller?: string;
  message_body?: string;
}
export interface MessageAminoMsg {
  type: "/circle.cctp.v1.Message";
  value: MessageAmino;
}
/**
 * Generic message header for all messages passing through CCTP
 * The message body is dynamically-sized to support custom message body
 * formats. Other fields must be fixed-size to avoid hash collisions.
 * 
 * Padding: uintNN fields are left-padded, and bytesNN fields are right-padded.
 * 
 * @param version the version of the message format
 * @param source_domain domain of home chain
 * @param destination_domain domain of destination chain
 * @param nonce destination-specific nonce
 * @param sender address of sender on source chain as bytes32
 * @param recipient address of recipient on destination chain as bytes32
 * @param destination_caller address of caller on destination chain as bytes32
 * @param message_body raw bytes of message body
 */
export interface MessageSDKType {
  version: number;
  source_domain: number;
  destination_domain: number;
  nonce: Long;
  sender: Uint8Array;
  recipient: Uint8Array;
  destination_caller: Uint8Array;
  message_body: Uint8Array;
}
function createBaseMessage(): Message {
  return {
    version: 0,
    sourceDomain: 0,
    destinationDomain: 0,
    nonce: Long.UZERO,
    sender: new Uint8Array(),
    recipient: new Uint8Array(),
    destinationCaller: new Uint8Array(),
    messageBody: new Uint8Array()
  };
}
export const Message = {
  typeUrl: "/circle.cctp.v1.Message",
  encode(message: Message, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.version !== 0) {
      writer.uint32(8).uint32(message.version);
    }
    if (message.sourceDomain !== 0) {
      writer.uint32(16).uint32(message.sourceDomain);
    }
    if (message.destinationDomain !== 0) {
      writer.uint32(24).uint32(message.destinationDomain);
    }
    if (!message.nonce.isZero()) {
      writer.uint32(32).uint64(message.nonce);
    }
    if (message.sender.length !== 0) {
      writer.uint32(42).bytes(message.sender);
    }
    if (message.recipient.length !== 0) {
      writer.uint32(50).bytes(message.recipient);
    }
    if (message.destinationCaller.length !== 0) {
      writer.uint32(58).bytes(message.destinationCaller);
    }
    if (message.messageBody.length !== 0) {
      writer.uint32(66).bytes(message.messageBody);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Message {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.uint32();
          break;
        case 2:
          message.sourceDomain = reader.uint32();
          break;
        case 3:
          message.destinationDomain = reader.uint32();
          break;
        case 4:
          message.nonce = (reader.uint64() as Long);
          break;
        case 5:
          message.sender = reader.bytes();
          break;
        case 6:
          message.recipient = reader.bytes();
          break;
        case 7:
          message.destinationCaller = reader.bytes();
          break;
        case 8:
          message.messageBody = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Message {
    return {
      version: isSet(object.version) ? Number(object.version) : 0,
      sourceDomain: isSet(object.sourceDomain) ? Number(object.sourceDomain) : 0,
      destinationDomain: isSet(object.destinationDomain) ? Number(object.destinationDomain) : 0,
      nonce: isSet(object.nonce) ? Long.fromValue(object.nonce) : Long.UZERO,
      sender: isSet(object.sender) ? bytesFromBase64(object.sender) : new Uint8Array(),
      recipient: isSet(object.recipient) ? bytesFromBase64(object.recipient) : new Uint8Array(),
      destinationCaller: isSet(object.destinationCaller) ? bytesFromBase64(object.destinationCaller) : new Uint8Array(),
      messageBody: isSet(object.messageBody) ? bytesFromBase64(object.messageBody) : new Uint8Array()
    };
  },
  toJSON(message: Message): JsonSafe<Message> {
    const obj: any = {};
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.sourceDomain !== undefined && (obj.sourceDomain = Math.round(message.sourceDomain));
    message.destinationDomain !== undefined && (obj.destinationDomain = Math.round(message.destinationDomain));
    message.nonce !== undefined && (obj.nonce = (message.nonce || Long.UZERO).toString());
    message.sender !== undefined && (obj.sender = base64FromBytes(message.sender !== undefined ? message.sender : new Uint8Array()));
    message.recipient !== undefined && (obj.recipient = base64FromBytes(message.recipient !== undefined ? message.recipient : new Uint8Array()));
    message.destinationCaller !== undefined && (obj.destinationCaller = base64FromBytes(message.destinationCaller !== undefined ? message.destinationCaller : new Uint8Array()));
    message.messageBody !== undefined && (obj.messageBody = base64FromBytes(message.messageBody !== undefined ? message.messageBody : new Uint8Array()));
    return obj;
  },
  fromPartial(object: Partial<Message>): Message {
    const message = createBaseMessage();
    message.version = object.version ?? 0;
    message.sourceDomain = object.sourceDomain ?? 0;
    message.destinationDomain = object.destinationDomain ?? 0;
    message.nonce = object.nonce !== undefined && object.nonce !== null ? Long.fromValue(object.nonce) : Long.UZERO;
    message.sender = object.sender ?? new Uint8Array();
    message.recipient = object.recipient ?? new Uint8Array();
    message.destinationCaller = object.destinationCaller ?? new Uint8Array();
    message.messageBody = object.messageBody ?? new Uint8Array();
    return message;
  },
  fromAmino(object: MessageAmino): Message {
    const message = createBaseMessage();
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    }
    if (object.source_domain !== undefined && object.source_domain !== null) {
      message.sourceDomain = object.source_domain;
    }
    if (object.destination_domain !== undefined && object.destination_domain !== null) {
      message.destinationDomain = object.destination_domain;
    }
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = Long.fromString(object.nonce);
    }
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = bytesFromBase64(object.sender);
    }
    if (object.recipient !== undefined && object.recipient !== null) {
      message.recipient = bytesFromBase64(object.recipient);
    }
    if (object.destination_caller !== undefined && object.destination_caller !== null) {
      message.destinationCaller = bytesFromBase64(object.destination_caller);
    }
    if (object.message_body !== undefined && object.message_body !== null) {
      message.messageBody = bytesFromBase64(object.message_body);
    }
    return message;
  },
  toAmino(message: Message): MessageAmino {
    const obj: any = {};
    obj.version = message.version === 0 ? undefined : message.version;
    obj.source_domain = message.sourceDomain === 0 ? undefined : message.sourceDomain;
    obj.destination_domain = message.destinationDomain === 0 ? undefined : message.destinationDomain;
    obj.nonce = !message.nonce.isZero() ? message.nonce.toString() : undefined;
    obj.sender = message.sender ? base64FromBytes(message.sender) : undefined;
    obj.recipient = message.recipient ? base64FromBytes(message.recipient) : undefined;
    obj.destination_caller = message.destinationCaller ? base64FromBytes(message.destinationCaller) : undefined;
    obj.message_body = message.messageBody ? base64FromBytes(message.messageBody) : undefined;
    return obj;
  },
  fromAminoMsg(object: MessageAminoMsg): Message {
    return Message.fromAmino(object.value);
  },
  fromProtoMsg(message: MessageProtoMsg): Message {
    return Message.decode(message.value);
  },
  toProto(message: Message): Uint8Array {
    return Message.encode(message).finish();
  },
  toProtoMsg(message: Message): MessageProtoMsg {
    return {
      typeUrl: "/circle.cctp.v1.Message",
      value: Message.encode(message).finish()
    };
  }
};