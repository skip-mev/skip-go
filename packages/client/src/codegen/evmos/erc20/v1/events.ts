//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/** EventRegisterPair is an event emitted when a coin is registered. */
export interface EventRegisterPair {
  /** denom is the coin's denomination. */
  denom: string;
  /** erc20_address is the ERC20 contract address. */
  erc20Address: string;
}
export interface EventRegisterPairProtoMsg {
  typeUrl: "/evmos.erc20.v1.EventRegisterPair";
  value: Uint8Array;
}
/** EventRegisterPair is an event emitted when a coin is registered. */
export interface EventRegisterPairAmino {
  /** denom is the coin's denomination. */
  denom?: string;
  /** erc20_address is the ERC20 contract address. */
  erc20_address?: string;
}
export interface EventRegisterPairAminoMsg {
  type: "erc20/EventRegisterPair";
  value: EventRegisterPairAmino;
}
/** EventRegisterPair is an event emitted when a coin is registered. */
export interface EventRegisterPairSDKType {
  denom: string;
  erc20_address: string;
}
/** EventToggleTokenConversion is an event emitted when a coin's token conversion is toggled. */
export interface EventToggleTokenConversion {
  /** denom is the coin's denomination. */
  denom: string;
  /** erc20_address is the ERC20 contract address. */
  erc20Address: string;
}
export interface EventToggleTokenConversionProtoMsg {
  typeUrl: "/evmos.erc20.v1.EventToggleTokenConversion";
  value: Uint8Array;
}
/** EventToggleTokenConversion is an event emitted when a coin's token conversion is toggled. */
export interface EventToggleTokenConversionAmino {
  /** denom is the coin's denomination. */
  denom?: string;
  /** erc20_address is the ERC20 contract address. */
  erc20_address?: string;
}
export interface EventToggleTokenConversionAminoMsg {
  type: "erc20/EventToggleTokenConversion";
  value: EventToggleTokenConversionAmino;
}
/** EventToggleTokenConversion is an event emitted when a coin's token conversion is toggled. */
export interface EventToggleTokenConversionSDKType {
  denom: string;
  erc20_address: string;
}
/** EventConvertCoin is an event emitted when a coin is converted. */
export interface EventConvertCoin {
  /** sender is the sender's address. */
  sender: string;
  /** receiver is the receiver's address. */
  receiver: string;
  /** amount is the amount of coins to be converted. */
  amount: string;
  /** denom is the coin's denomination. */
  denom: string;
  /** erc20_address is the ERC20 contract address. */
  erc20Address: string;
}
export interface EventConvertCoinProtoMsg {
  typeUrl: "/evmos.erc20.v1.EventConvertCoin";
  value: Uint8Array;
}
/** EventConvertCoin is an event emitted when a coin is converted. */
export interface EventConvertCoinAmino {
  /** sender is the sender's address. */
  sender?: string;
  /** receiver is the receiver's address. */
  receiver?: string;
  /** amount is the amount of coins to be converted. */
  amount?: string;
  /** denom is the coin's denomination. */
  denom?: string;
  /** erc20_address is the ERC20 contract address. */
  erc20_address?: string;
}
export interface EventConvertCoinAminoMsg {
  type: "erc20/EventConvertCoin";
  value: EventConvertCoinAmino;
}
/** EventConvertCoin is an event emitted when a coin is converted. */
export interface EventConvertCoinSDKType {
  sender: string;
  receiver: string;
  amount: string;
  denom: string;
  erc20_address: string;
}
/** EventConvertERC20 is an event emitted when an ERC20 is converted. */
export interface EventConvertERC20 {
  /** sender is the sender's address. */
  sender: string;
  /** receiver is the receiver's address. */
  receiver: string;
  /** amount is the amount of coins to be converted. */
  amount: string;
  /** denom is the coin's denomination. */
  denom: string;
  /** contract_address of an ERC20 token contract, that is registered in a token pair */
  contractAddress: string;
}
export interface EventConvertERC20ProtoMsg {
  typeUrl: "/evmos.erc20.v1.EventConvertERC20";
  value: Uint8Array;
}
/** EventConvertERC20 is an event emitted when an ERC20 is converted. */
export interface EventConvertERC20Amino {
  /** sender is the sender's address. */
  sender?: string;
  /** receiver is the receiver's address. */
  receiver?: string;
  /** amount is the amount of coins to be converted. */
  amount?: string;
  /** denom is the coin's denomination. */
  denom?: string;
  /** contract_address of an ERC20 token contract, that is registered in a token pair */
  contract_address?: string;
}
export interface EventConvertERC20AminoMsg {
  type: "erc20/EventConvertERC20";
  value: EventConvertERC20Amino;
}
/** EventConvertERC20 is an event emitted when an ERC20 is converted. */
export interface EventConvertERC20SDKType {
  sender: string;
  receiver: string;
  amount: string;
  denom: string;
  contract_address: string;
}
function createBaseEventRegisterPair(): EventRegisterPair {
  return {
    denom: "",
    erc20Address: ""
  };
}
export const EventRegisterPair = {
  typeUrl: "/evmos.erc20.v1.EventRegisterPair",
  encode(message: EventRegisterPair, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.erc20Address !== "") {
      writer.uint32(18).string(message.erc20Address);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventRegisterPair {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventRegisterPair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.erc20Address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventRegisterPair {
    return {
      denom: isSet(object.denom) ? String(object.denom) : "",
      erc20Address: isSet(object.erc20Address) ? String(object.erc20Address) : ""
    };
  },
  toJSON(message: EventRegisterPair): JsonSafe<EventRegisterPair> {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.erc20Address !== undefined && (obj.erc20Address = message.erc20Address);
    return obj;
  },
  fromPartial(object: Partial<EventRegisterPair>): EventRegisterPair {
    const message = createBaseEventRegisterPair();
    message.denom = object.denom ?? "";
    message.erc20Address = object.erc20Address ?? "";
    return message;
  },
  fromAmino(object: EventRegisterPairAmino): EventRegisterPair {
    const message = createBaseEventRegisterPair();
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    }
    if (object.erc20_address !== undefined && object.erc20_address !== null) {
      message.erc20Address = object.erc20_address;
    }
    return message;
  },
  toAmino(message: EventRegisterPair): EventRegisterPairAmino {
    const obj: any = {};
    obj.denom = message.denom === "" ? undefined : message.denom;
    obj.erc20_address = message.erc20Address === "" ? undefined : message.erc20Address;
    return obj;
  },
  fromAminoMsg(object: EventRegisterPairAminoMsg): EventRegisterPair {
    return EventRegisterPair.fromAmino(object.value);
  },
  toAminoMsg(message: EventRegisterPair): EventRegisterPairAminoMsg {
    return {
      type: "erc20/EventRegisterPair",
      value: EventRegisterPair.toAmino(message)
    };
  },
  fromProtoMsg(message: EventRegisterPairProtoMsg): EventRegisterPair {
    return EventRegisterPair.decode(message.value);
  },
  toProto(message: EventRegisterPair): Uint8Array {
    return EventRegisterPair.encode(message).finish();
  },
  toProtoMsg(message: EventRegisterPair): EventRegisterPairProtoMsg {
    return {
      typeUrl: "/evmos.erc20.v1.EventRegisterPair",
      value: EventRegisterPair.encode(message).finish()
    };
  }
};
function createBaseEventToggleTokenConversion(): EventToggleTokenConversion {
  return {
    denom: "",
    erc20Address: ""
  };
}
export const EventToggleTokenConversion = {
  typeUrl: "/evmos.erc20.v1.EventToggleTokenConversion",
  encode(message: EventToggleTokenConversion, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.erc20Address !== "") {
      writer.uint32(18).string(message.erc20Address);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventToggleTokenConversion {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventToggleTokenConversion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.erc20Address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventToggleTokenConversion {
    return {
      denom: isSet(object.denom) ? String(object.denom) : "",
      erc20Address: isSet(object.erc20Address) ? String(object.erc20Address) : ""
    };
  },
  toJSON(message: EventToggleTokenConversion): JsonSafe<EventToggleTokenConversion> {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.erc20Address !== undefined && (obj.erc20Address = message.erc20Address);
    return obj;
  },
  fromPartial(object: Partial<EventToggleTokenConversion>): EventToggleTokenConversion {
    const message = createBaseEventToggleTokenConversion();
    message.denom = object.denom ?? "";
    message.erc20Address = object.erc20Address ?? "";
    return message;
  },
  fromAmino(object: EventToggleTokenConversionAmino): EventToggleTokenConversion {
    const message = createBaseEventToggleTokenConversion();
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    }
    if (object.erc20_address !== undefined && object.erc20_address !== null) {
      message.erc20Address = object.erc20_address;
    }
    return message;
  },
  toAmino(message: EventToggleTokenConversion): EventToggleTokenConversionAmino {
    const obj: any = {};
    obj.denom = message.denom === "" ? undefined : message.denom;
    obj.erc20_address = message.erc20Address === "" ? undefined : message.erc20Address;
    return obj;
  },
  fromAminoMsg(object: EventToggleTokenConversionAminoMsg): EventToggleTokenConversion {
    return EventToggleTokenConversion.fromAmino(object.value);
  },
  toAminoMsg(message: EventToggleTokenConversion): EventToggleTokenConversionAminoMsg {
    return {
      type: "erc20/EventToggleTokenConversion",
      value: EventToggleTokenConversion.toAmino(message)
    };
  },
  fromProtoMsg(message: EventToggleTokenConversionProtoMsg): EventToggleTokenConversion {
    return EventToggleTokenConversion.decode(message.value);
  },
  toProto(message: EventToggleTokenConversion): Uint8Array {
    return EventToggleTokenConversion.encode(message).finish();
  },
  toProtoMsg(message: EventToggleTokenConversion): EventToggleTokenConversionProtoMsg {
    return {
      typeUrl: "/evmos.erc20.v1.EventToggleTokenConversion",
      value: EventToggleTokenConversion.encode(message).finish()
    };
  }
};
function createBaseEventConvertCoin(): EventConvertCoin {
  return {
    sender: "",
    receiver: "",
    amount: "",
    denom: "",
    erc20Address: ""
  };
}
export const EventConvertCoin = {
  typeUrl: "/evmos.erc20.v1.EventConvertCoin",
  encode(message: EventConvertCoin, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.receiver !== "") {
      writer.uint32(18).string(message.receiver);
    }
    if (message.amount !== "") {
      writer.uint32(26).string(message.amount);
    }
    if (message.denom !== "") {
      writer.uint32(34).string(message.denom);
    }
    if (message.erc20Address !== "") {
      writer.uint32(42).string(message.erc20Address);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventConvertCoin {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventConvertCoin();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.receiver = reader.string();
          break;
        case 3:
          message.amount = reader.string();
          break;
        case 4:
          message.denom = reader.string();
          break;
        case 5:
          message.erc20Address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventConvertCoin {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      receiver: isSet(object.receiver) ? String(object.receiver) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      denom: isSet(object.denom) ? String(object.denom) : "",
      erc20Address: isSet(object.erc20Address) ? String(object.erc20Address) : ""
    };
  },
  toJSON(message: EventConvertCoin): JsonSafe<EventConvertCoin> {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.receiver !== undefined && (obj.receiver = message.receiver);
    message.amount !== undefined && (obj.amount = message.amount);
    message.denom !== undefined && (obj.denom = message.denom);
    message.erc20Address !== undefined && (obj.erc20Address = message.erc20Address);
    return obj;
  },
  fromPartial(object: Partial<EventConvertCoin>): EventConvertCoin {
    const message = createBaseEventConvertCoin();
    message.sender = object.sender ?? "";
    message.receiver = object.receiver ?? "";
    message.amount = object.amount ?? "";
    message.denom = object.denom ?? "";
    message.erc20Address = object.erc20Address ?? "";
    return message;
  },
  fromAmino(object: EventConvertCoinAmino): EventConvertCoin {
    const message = createBaseEventConvertCoin();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    if (object.receiver !== undefined && object.receiver !== null) {
      message.receiver = object.receiver;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    }
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    }
    if (object.erc20_address !== undefined && object.erc20_address !== null) {
      message.erc20Address = object.erc20_address;
    }
    return message;
  },
  toAmino(message: EventConvertCoin): EventConvertCoinAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    obj.receiver = message.receiver === "" ? undefined : message.receiver;
    obj.amount = message.amount === "" ? undefined : message.amount;
    obj.denom = message.denom === "" ? undefined : message.denom;
    obj.erc20_address = message.erc20Address === "" ? undefined : message.erc20Address;
    return obj;
  },
  fromAminoMsg(object: EventConvertCoinAminoMsg): EventConvertCoin {
    return EventConvertCoin.fromAmino(object.value);
  },
  toAminoMsg(message: EventConvertCoin): EventConvertCoinAminoMsg {
    return {
      type: "erc20/EventConvertCoin",
      value: EventConvertCoin.toAmino(message)
    };
  },
  fromProtoMsg(message: EventConvertCoinProtoMsg): EventConvertCoin {
    return EventConvertCoin.decode(message.value);
  },
  toProto(message: EventConvertCoin): Uint8Array {
    return EventConvertCoin.encode(message).finish();
  },
  toProtoMsg(message: EventConvertCoin): EventConvertCoinProtoMsg {
    return {
      typeUrl: "/evmos.erc20.v1.EventConvertCoin",
      value: EventConvertCoin.encode(message).finish()
    };
  }
};
function createBaseEventConvertERC20(): EventConvertERC20 {
  return {
    sender: "",
    receiver: "",
    amount: "",
    denom: "",
    contractAddress: ""
  };
}
export const EventConvertERC20 = {
  typeUrl: "/evmos.erc20.v1.EventConvertERC20",
  encode(message: EventConvertERC20, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.receiver !== "") {
      writer.uint32(18).string(message.receiver);
    }
    if (message.amount !== "") {
      writer.uint32(26).string(message.amount);
    }
    if (message.denom !== "") {
      writer.uint32(34).string(message.denom);
    }
    if (message.contractAddress !== "") {
      writer.uint32(42).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventConvertERC20 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventConvertERC20();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.receiver = reader.string();
          break;
        case 3:
          message.amount = reader.string();
          break;
        case 4:
          message.denom = reader.string();
          break;
        case 5:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventConvertERC20 {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      receiver: isSet(object.receiver) ? String(object.receiver) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      denom: isSet(object.denom) ? String(object.denom) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: EventConvertERC20): JsonSafe<EventConvertERC20> {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.receiver !== undefined && (obj.receiver = message.receiver);
    message.amount !== undefined && (obj.amount = message.amount);
    message.denom !== undefined && (obj.denom = message.denom);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<EventConvertERC20>): EventConvertERC20 {
    const message = createBaseEventConvertERC20();
    message.sender = object.sender ?? "";
    message.receiver = object.receiver ?? "";
    message.amount = object.amount ?? "";
    message.denom = object.denom ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromAmino(object: EventConvertERC20Amino): EventConvertERC20 {
    const message = createBaseEventConvertERC20();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    if (object.receiver !== undefined && object.receiver !== null) {
      message.receiver = object.receiver;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    }
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    }
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    return message;
  },
  toAmino(message: EventConvertERC20): EventConvertERC20Amino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    obj.receiver = message.receiver === "" ? undefined : message.receiver;
    obj.amount = message.amount === "" ? undefined : message.amount;
    obj.denom = message.denom === "" ? undefined : message.denom;
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    return obj;
  },
  fromAminoMsg(object: EventConvertERC20AminoMsg): EventConvertERC20 {
    return EventConvertERC20.fromAmino(object.value);
  },
  toAminoMsg(message: EventConvertERC20): EventConvertERC20AminoMsg {
    return {
      type: "erc20/EventConvertERC20",
      value: EventConvertERC20.toAmino(message)
    };
  },
  fromProtoMsg(message: EventConvertERC20ProtoMsg): EventConvertERC20 {
    return EventConvertERC20.decode(message.value);
  },
  toProto(message: EventConvertERC20): Uint8Array {
    return EventConvertERC20.encode(message).finish();
  },
  toProtoMsg(message: EventConvertERC20): EventConvertERC20ProtoMsg {
    return {
      typeUrl: "/evmos.erc20.v1.EventConvertERC20",
      value: EventConvertERC20.encode(message).finish()
    };
  }
};