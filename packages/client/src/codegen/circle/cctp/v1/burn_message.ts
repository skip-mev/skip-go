//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet, bytesFromBase64, base64FromBytes } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * Message format for BurnMessages
 * @param version the message body version
 * @param burn_token the burn token address on source domain as bytes32
 * @param mint_recipient the mint recipient address as bytes32
 * @param amount the burn amount
 * @param message_sender the message sender
 */
export interface BurnMessage {
  version: number;
  burnToken: Uint8Array;
  mintRecipient: Uint8Array;
  amount: string;
  messageSender: Uint8Array;
}
export interface BurnMessageProtoMsg {
  typeUrl: "/circle.cctp.v1.BurnMessage";
  value: Uint8Array;
}
/**
 * Message format for BurnMessages
 * @param version the message body version
 * @param burn_token the burn token address on source domain as bytes32
 * @param mint_recipient the mint recipient address as bytes32
 * @param amount the burn amount
 * @param message_sender the message sender
 * @name BurnMessageAmino
 * @package circle.cctp.v1
 * @see proto type: circle.cctp.v1.BurnMessage
 */
export interface BurnMessageAmino {
  version?: number;
  burn_token?: string;
  mint_recipient?: string;
  amount?: string;
  message_sender?: string;
}
export interface BurnMessageAminoMsg {
  type: "/circle.cctp.v1.BurnMessage";
  value: BurnMessageAmino;
}
/**
 * Message format for BurnMessages
 * @param version the message body version
 * @param burn_token the burn token address on source domain as bytes32
 * @param mint_recipient the mint recipient address as bytes32
 * @param amount the burn amount
 * @param message_sender the message sender
 */
export interface BurnMessageSDKType {
  version: number;
  burn_token: Uint8Array;
  mint_recipient: Uint8Array;
  amount: string;
  message_sender: Uint8Array;
}
function createBaseBurnMessage(): BurnMessage {
  return {
    version: 0,
    burnToken: new Uint8Array(),
    mintRecipient: new Uint8Array(),
    amount: "",
    messageSender: new Uint8Array()
  };
}
export const BurnMessage = {
  typeUrl: "/circle.cctp.v1.BurnMessage",
  encode(message: BurnMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.version !== 0) {
      writer.uint32(8).uint32(message.version);
    }
    if (message.burnToken.length !== 0) {
      writer.uint32(18).bytes(message.burnToken);
    }
    if (message.mintRecipient.length !== 0) {
      writer.uint32(26).bytes(message.mintRecipient);
    }
    if (message.amount !== "") {
      writer.uint32(34).string(message.amount);
    }
    if (message.messageSender.length !== 0) {
      writer.uint32(42).bytes(message.messageSender);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): BurnMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBurnMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.uint32();
          break;
        case 2:
          message.burnToken = reader.bytes();
          break;
        case 3:
          message.mintRecipient = reader.bytes();
          break;
        case 4:
          message.amount = reader.string();
          break;
        case 5:
          message.messageSender = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BurnMessage {
    return {
      version: isSet(object.version) ? Number(object.version) : 0,
      burnToken: isSet(object.burnToken) ? bytesFromBase64(object.burnToken) : new Uint8Array(),
      mintRecipient: isSet(object.mintRecipient) ? bytesFromBase64(object.mintRecipient) : new Uint8Array(),
      amount: isSet(object.amount) ? String(object.amount) : "",
      messageSender: isSet(object.messageSender) ? bytesFromBase64(object.messageSender) : new Uint8Array()
    };
  },
  toJSON(message: BurnMessage): JsonSafe<BurnMessage> {
    const obj: any = {};
    message.version !== undefined && (obj.version = Math.round(message.version));
    message.burnToken !== undefined && (obj.burnToken = base64FromBytes(message.burnToken !== undefined ? message.burnToken : new Uint8Array()));
    message.mintRecipient !== undefined && (obj.mintRecipient = base64FromBytes(message.mintRecipient !== undefined ? message.mintRecipient : new Uint8Array()));
    message.amount !== undefined && (obj.amount = message.amount);
    message.messageSender !== undefined && (obj.messageSender = base64FromBytes(message.messageSender !== undefined ? message.messageSender : new Uint8Array()));
    return obj;
  },
  fromPartial(object: Partial<BurnMessage>): BurnMessage {
    const message = createBaseBurnMessage();
    message.version = object.version ?? 0;
    message.burnToken = object.burnToken ?? new Uint8Array();
    message.mintRecipient = object.mintRecipient ?? new Uint8Array();
    message.amount = object.amount ?? "";
    message.messageSender = object.messageSender ?? new Uint8Array();
    return message;
  },
  fromAmino(object: BurnMessageAmino): BurnMessage {
    const message = createBaseBurnMessage();
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    }
    if (object.burn_token !== undefined && object.burn_token !== null) {
      message.burnToken = bytesFromBase64(object.burn_token);
    }
    if (object.mint_recipient !== undefined && object.mint_recipient !== null) {
      message.mintRecipient = bytesFromBase64(object.mint_recipient);
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    }
    if (object.message_sender !== undefined && object.message_sender !== null) {
      message.messageSender = bytesFromBase64(object.message_sender);
    }
    return message;
  },
  toAmino(message: BurnMessage): BurnMessageAmino {
    const obj: any = {};
    obj.version = message.version === 0 ? undefined : message.version;
    obj.burn_token = message.burnToken ? base64FromBytes(message.burnToken) : undefined;
    obj.mint_recipient = message.mintRecipient ? base64FromBytes(message.mintRecipient) : undefined;
    obj.amount = message.amount === "" ? undefined : message.amount;
    obj.message_sender = message.messageSender ? base64FromBytes(message.messageSender) : undefined;
    return obj;
  },
  fromAminoMsg(object: BurnMessageAminoMsg): BurnMessage {
    return BurnMessage.fromAmino(object.value);
  },
  fromProtoMsg(message: BurnMessageProtoMsg): BurnMessage {
    return BurnMessage.decode(message.value);
  },
  toProto(message: BurnMessage): Uint8Array {
    return BurnMessage.encode(message).finish();
  },
  toProtoMsg(message: BurnMessage): BurnMessageProtoMsg {
    return {
      typeUrl: "/circle.cctp.v1.BurnMessage",
      value: BurnMessage.encode(message).finish()
    };
  }
};