//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Long, isSet, bytesFromBase64, base64FromBytes } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/** MsgInitiateTokenDeposit defines a SDK message for adding a new validator. */
export interface MsgInitiateTokenDeposit {
  sender: string;
  bridgeId: Long;
  to: string;
  amount: Coin;
  data?: Uint8Array;
}
export interface MsgInitiateTokenDepositProtoMsg {
  typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit";
  value: Uint8Array;
}
/** MsgInitiateTokenDeposit defines a SDK message for adding a new validator. */
export interface MsgInitiateTokenDepositAmino {
  sender?: string;
  bridge_id?: string;
  to?: string;
  amount: CoinAmino;
  data?: string;
}
export interface MsgInitiateTokenDepositAminoMsg {
  type: "ophost/MsgInitiateTokenDeposit";
  value: MsgInitiateTokenDepositAmino;
}
/** MsgInitiateTokenDeposit defines a SDK message for adding a new validator. */
export interface MsgInitiateTokenDepositSDKType {
  sender: string;
  bridge_id: Long;
  to: string;
  amount: CoinSDKType;
  data?: Uint8Array;
}
/** MsgInitiateTokenDepositResponse returns a message handle result. */
export interface MsgInitiateTokenDepositResponse {
  sequence: Long;
}
export interface MsgInitiateTokenDepositResponseProtoMsg {
  typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDepositResponse";
  value: Uint8Array;
}
/** MsgInitiateTokenDepositResponse returns a message handle result. */
export interface MsgInitiateTokenDepositResponseAmino {
  sequence?: string;
}
export interface MsgInitiateTokenDepositResponseAminoMsg {
  type: "/opinit.ophost.v1.MsgInitiateTokenDepositResponse";
  value: MsgInitiateTokenDepositResponseAmino;
}
/** MsgInitiateTokenDepositResponse returns a message handle result. */
export interface MsgInitiateTokenDepositResponseSDKType {
  sequence: Long;
}
function createBaseMsgInitiateTokenDeposit(): MsgInitiateTokenDeposit {
  return {
    sender: "",
    bridgeId: Long.UZERO,
    to: "",
    amount: Coin.fromPartial({}),
    data: undefined
  };
}
export const MsgInitiateTokenDeposit = {
  typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit",
  encode(message: MsgInitiateTokenDeposit, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (!message.bridgeId.isZero()) {
      writer.uint32(16).uint64(message.bridgeId);
    }
    if (message.to !== "") {
      writer.uint32(26).string(message.to);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(34).fork()).ldelim();
    }
    if (message.data !== undefined) {
      writer.uint32(42).bytes(message.data);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInitiateTokenDeposit {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInitiateTokenDeposit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.bridgeId = (reader.uint64() as Long);
          break;
        case 3:
          message.to = reader.string();
          break;
        case 4:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 5:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgInitiateTokenDeposit {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      bridgeId: isSet(object.bridgeId) ? Long.fromValue(object.bridgeId) : Long.UZERO,
      to: isSet(object.to) ? String(object.to) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      data: isSet(object.data) ? bytesFromBase64(object.data) : undefined
    };
  },
  toJSON(message: MsgInitiateTokenDeposit): JsonSafe<MsgInitiateTokenDeposit> {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.bridgeId !== undefined && (obj.bridgeId = (message.bridgeId || Long.UZERO).toString());
    message.to !== undefined && (obj.to = message.to);
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.data !== undefined && (obj.data = message.data !== undefined ? base64FromBytes(message.data) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgInitiateTokenDeposit>): MsgInitiateTokenDeposit {
    const message = createBaseMsgInitiateTokenDeposit();
    message.sender = object.sender ?? "";
    message.bridgeId = object.bridgeId !== undefined && object.bridgeId !== null ? Long.fromValue(object.bridgeId) : Long.UZERO;
    message.to = object.to ?? "";
    message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
    message.data = object.data ?? undefined;
    return message;
  },
  fromAmino(object: MsgInitiateTokenDepositAmino): MsgInitiateTokenDeposit {
    const message = createBaseMsgInitiateTokenDeposit();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    if (object.bridge_id !== undefined && object.bridge_id !== null) {
      message.bridgeId = Long.fromString(object.bridge_id);
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = object.to;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Coin.fromAmino(object.amount);
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    return message;
  },
  toAmino(message: MsgInitiateTokenDeposit): MsgInitiateTokenDepositAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    obj.bridge_id = !message.bridgeId.isZero() ? message.bridgeId.toString() : undefined;
    obj.to = message.to === "" ? undefined : message.to;
    obj.amount = message.amount ? Coin.toAmino(message.amount) : Coin.toAmino(Coin.fromPartial({}));
    obj.data = message.data ? base64FromBytes(message.data) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgInitiateTokenDepositAminoMsg): MsgInitiateTokenDeposit {
    return MsgInitiateTokenDeposit.fromAmino(object.value);
  },
  toAminoMsg(message: MsgInitiateTokenDeposit): MsgInitiateTokenDepositAminoMsg {
    return {
      type: "ophost/MsgInitiateTokenDeposit",
      value: MsgInitiateTokenDeposit.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgInitiateTokenDepositProtoMsg): MsgInitiateTokenDeposit {
    return MsgInitiateTokenDeposit.decode(message.value);
  },
  toProto(message: MsgInitiateTokenDeposit): Uint8Array {
    return MsgInitiateTokenDeposit.encode(message).finish();
  },
  toProtoMsg(message: MsgInitiateTokenDeposit): MsgInitiateTokenDepositProtoMsg {
    return {
      typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit",
      value: MsgInitiateTokenDeposit.encode(message).finish()
    };
  }
};
function createBaseMsgInitiateTokenDepositResponse(): MsgInitiateTokenDepositResponse {
  return {
    sequence: Long.UZERO
  };
}
export const MsgInitiateTokenDepositResponse = {
  typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDepositResponse",
  encode(message: MsgInitiateTokenDepositResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.sequence.isZero()) {
      writer.uint32(8).uint64(message.sequence);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInitiateTokenDepositResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInitiateTokenDepositResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sequence = (reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgInitiateTokenDepositResponse {
    return {
      sequence: isSet(object.sequence) ? Long.fromValue(object.sequence) : Long.UZERO
    };
  },
  toJSON(message: MsgInitiateTokenDepositResponse): JsonSafe<MsgInitiateTokenDepositResponse> {
    const obj: any = {};
    message.sequence !== undefined && (obj.sequence = (message.sequence || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<MsgInitiateTokenDepositResponse>): MsgInitiateTokenDepositResponse {
    const message = createBaseMsgInitiateTokenDepositResponse();
    message.sequence = object.sequence !== undefined && object.sequence !== null ? Long.fromValue(object.sequence) : Long.UZERO;
    return message;
  },
  fromAmino(object: MsgInitiateTokenDepositResponseAmino): MsgInitiateTokenDepositResponse {
    const message = createBaseMsgInitiateTokenDepositResponse();
    if (object.sequence !== undefined && object.sequence !== null) {
      message.sequence = Long.fromString(object.sequence);
    }
    return message;
  },
  toAmino(message: MsgInitiateTokenDepositResponse): MsgInitiateTokenDepositResponseAmino {
    const obj: any = {};
    obj.sequence = !message.sequence.isZero() ? message.sequence.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgInitiateTokenDepositResponseAminoMsg): MsgInitiateTokenDepositResponse {
    return MsgInitiateTokenDepositResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgInitiateTokenDepositResponseProtoMsg): MsgInitiateTokenDepositResponse {
    return MsgInitiateTokenDepositResponse.decode(message.value);
  },
  toProto(message: MsgInitiateTokenDepositResponse): Uint8Array {
    return MsgInitiateTokenDepositResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgInitiateTokenDepositResponse): MsgInitiateTokenDepositResponseProtoMsg {
    return {
      typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDepositResponse",
      value: MsgInitiateTokenDepositResponse.encode(message).finish()
    };
  }
};