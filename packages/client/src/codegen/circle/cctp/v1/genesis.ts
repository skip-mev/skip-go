//@ts-nocheck
import { Attester, AttesterAmino, AttesterSDKType } from "./attester";
import { PerMessageBurnLimit, PerMessageBurnLimitAmino, PerMessageBurnLimitSDKType } from "./per_message_burn_limit";
import { BurningAndMintingPaused, BurningAndMintingPausedAmino, BurningAndMintingPausedSDKType } from "./burning_and_minting_paused";
import { SendingAndReceivingMessagesPaused, SendingAndReceivingMessagesPausedAmino, SendingAndReceivingMessagesPausedSDKType } from "./sending_and_receiving_messages_paused";
import { MaxMessageBodySize, MaxMessageBodySizeAmino, MaxMessageBodySizeSDKType } from "./max_message_body_size";
import { Nonce, NonceAmino, NonceSDKType } from "./nonce";
import { SignatureThreshold, SignatureThresholdAmino, SignatureThresholdSDKType } from "./signature_threshold";
import { TokenPair, TokenPairAmino, TokenPairSDKType } from "./token_pair";
import { RemoteTokenMessenger, RemoteTokenMessengerAmino, RemoteTokenMessengerSDKType } from "./remote_token_messenger";
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/** GenesisState defines the cctp module's genesis state. */
export interface GenesisState {
  owner: string;
  attesterManager: string;
  pauser: string;
  tokenController: string;
  attesterList: Attester[];
  perMessageBurnLimitList: PerMessageBurnLimit[];
  burningAndMintingPaused?: BurningAndMintingPaused;
  sendingAndReceivingMessagesPaused?: SendingAndReceivingMessagesPaused;
  maxMessageBodySize?: MaxMessageBodySize;
  nextAvailableNonce?: Nonce;
  signatureThreshold?: SignatureThreshold;
  tokenPairList: TokenPair[];
  usedNoncesList: Nonce[];
  tokenMessengerList: RemoteTokenMessenger[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/circle.cctp.v1.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines the cctp module's genesis state. */
export interface GenesisStateAmino {
  owner?: string;
  attester_manager?: string;
  pauser?: string;
  token_controller?: string;
  attester_list?: AttesterAmino[];
  per_message_burn_limit_list?: PerMessageBurnLimitAmino[];
  burning_and_minting_paused?: BurningAndMintingPausedAmino;
  sending_and_receiving_messages_paused?: SendingAndReceivingMessagesPausedAmino;
  max_message_body_size?: MaxMessageBodySizeAmino;
  next_available_nonce?: NonceAmino;
  signature_threshold?: SignatureThresholdAmino;
  token_pair_list?: TokenPairAmino[];
  used_nonces_list?: NonceAmino[];
  token_messenger_list?: RemoteTokenMessengerAmino[];
}
export interface GenesisStateAminoMsg {
  type: "/circle.cctp.v1.GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the cctp module's genesis state. */
export interface GenesisStateSDKType {
  owner: string;
  attester_manager: string;
  pauser: string;
  token_controller: string;
  attester_list: AttesterSDKType[];
  per_message_burn_limit_list: PerMessageBurnLimitSDKType[];
  burning_and_minting_paused?: BurningAndMintingPausedSDKType;
  sending_and_receiving_messages_paused?: SendingAndReceivingMessagesPausedSDKType;
  max_message_body_size?: MaxMessageBodySizeSDKType;
  next_available_nonce?: NonceSDKType;
  signature_threshold?: SignatureThresholdSDKType;
  token_pair_list: TokenPairSDKType[];
  used_nonces_list: NonceSDKType[];
  token_messenger_list: RemoteTokenMessengerSDKType[];
}
function createBaseGenesisState(): GenesisState {
  return {
    owner: "",
    attesterManager: "",
    pauser: "",
    tokenController: "",
    attesterList: [],
    perMessageBurnLimitList: [],
    burningAndMintingPaused: undefined,
    sendingAndReceivingMessagesPaused: undefined,
    maxMessageBodySize: undefined,
    nextAvailableNonce: undefined,
    signatureThreshold: undefined,
    tokenPairList: [],
    usedNoncesList: [],
    tokenMessengerList: []
  };
}
export const GenesisState = {
  typeUrl: "/circle.cctp.v1.GenesisState",
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.owner !== "") {
      writer.uint32(18).string(message.owner);
    }
    if (message.attesterManager !== "") {
      writer.uint32(26).string(message.attesterManager);
    }
    if (message.pauser !== "") {
      writer.uint32(34).string(message.pauser);
    }
    if (message.tokenController !== "") {
      writer.uint32(42).string(message.tokenController);
    }
    for (const v of message.attesterList) {
      Attester.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.perMessageBurnLimitList) {
      PerMessageBurnLimit.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.burningAndMintingPaused !== undefined) {
      BurningAndMintingPaused.encode(message.burningAndMintingPaused, writer.uint32(66).fork()).ldelim();
    }
    if (message.sendingAndReceivingMessagesPaused !== undefined) {
      SendingAndReceivingMessagesPaused.encode(message.sendingAndReceivingMessagesPaused, writer.uint32(74).fork()).ldelim();
    }
    if (message.maxMessageBodySize !== undefined) {
      MaxMessageBodySize.encode(message.maxMessageBodySize, writer.uint32(82).fork()).ldelim();
    }
    if (message.nextAvailableNonce !== undefined) {
      Nonce.encode(message.nextAvailableNonce, writer.uint32(90).fork()).ldelim();
    }
    if (message.signatureThreshold !== undefined) {
      SignatureThreshold.encode(message.signatureThreshold, writer.uint32(98).fork()).ldelim();
    }
    for (const v of message.tokenPairList) {
      TokenPair.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    for (const v of message.usedNoncesList) {
      Nonce.encode(v!, writer.uint32(114).fork()).ldelim();
    }
    for (const v of message.tokenMessengerList) {
      RemoteTokenMessenger.encode(v!, writer.uint32(122).fork()).ldelim();
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
        case 2:
          message.owner = reader.string();
          break;
        case 3:
          message.attesterManager = reader.string();
          break;
        case 4:
          message.pauser = reader.string();
          break;
        case 5:
          message.tokenController = reader.string();
          break;
        case 6:
          message.attesterList.push(Attester.decode(reader, reader.uint32()));
          break;
        case 7:
          message.perMessageBurnLimitList.push(PerMessageBurnLimit.decode(reader, reader.uint32()));
          break;
        case 8:
          message.burningAndMintingPaused = BurningAndMintingPaused.decode(reader, reader.uint32());
          break;
        case 9:
          message.sendingAndReceivingMessagesPaused = SendingAndReceivingMessagesPaused.decode(reader, reader.uint32());
          break;
        case 10:
          message.maxMessageBodySize = MaxMessageBodySize.decode(reader, reader.uint32());
          break;
        case 11:
          message.nextAvailableNonce = Nonce.decode(reader, reader.uint32());
          break;
        case 12:
          message.signatureThreshold = SignatureThreshold.decode(reader, reader.uint32());
          break;
        case 13:
          message.tokenPairList.push(TokenPair.decode(reader, reader.uint32()));
          break;
        case 14:
          message.usedNoncesList.push(Nonce.decode(reader, reader.uint32()));
          break;
        case 15:
          message.tokenMessengerList.push(RemoteTokenMessenger.decode(reader, reader.uint32()));
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
      owner: isSet(object.owner) ? String(object.owner) : "",
      attesterManager: isSet(object.attesterManager) ? String(object.attesterManager) : "",
      pauser: isSet(object.pauser) ? String(object.pauser) : "",
      tokenController: isSet(object.tokenController) ? String(object.tokenController) : "",
      attesterList: Array.isArray(object?.attesterList) ? object.attesterList.map((e: any) => Attester.fromJSON(e)) : [],
      perMessageBurnLimitList: Array.isArray(object?.perMessageBurnLimitList) ? object.perMessageBurnLimitList.map((e: any) => PerMessageBurnLimit.fromJSON(e)) : [],
      burningAndMintingPaused: isSet(object.burningAndMintingPaused) ? BurningAndMintingPaused.fromJSON(object.burningAndMintingPaused) : undefined,
      sendingAndReceivingMessagesPaused: isSet(object.sendingAndReceivingMessagesPaused) ? SendingAndReceivingMessagesPaused.fromJSON(object.sendingAndReceivingMessagesPaused) : undefined,
      maxMessageBodySize: isSet(object.maxMessageBodySize) ? MaxMessageBodySize.fromJSON(object.maxMessageBodySize) : undefined,
      nextAvailableNonce: isSet(object.nextAvailableNonce) ? Nonce.fromJSON(object.nextAvailableNonce) : undefined,
      signatureThreshold: isSet(object.signatureThreshold) ? SignatureThreshold.fromJSON(object.signatureThreshold) : undefined,
      tokenPairList: Array.isArray(object?.tokenPairList) ? object.tokenPairList.map((e: any) => TokenPair.fromJSON(e)) : [],
      usedNoncesList: Array.isArray(object?.usedNoncesList) ? object.usedNoncesList.map((e: any) => Nonce.fromJSON(e)) : [],
      tokenMessengerList: Array.isArray(object?.tokenMessengerList) ? object.tokenMessengerList.map((e: any) => RemoteTokenMessenger.fromJSON(e)) : []
    };
  },
  toJSON(message: GenesisState): JsonSafe<GenesisState> {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner);
    message.attesterManager !== undefined && (obj.attesterManager = message.attesterManager);
    message.pauser !== undefined && (obj.pauser = message.pauser);
    message.tokenController !== undefined && (obj.tokenController = message.tokenController);
    if (message.attesterList) {
      obj.attesterList = message.attesterList.map(e => e ? Attester.toJSON(e) : undefined);
    } else {
      obj.attesterList = [];
    }
    if (message.perMessageBurnLimitList) {
      obj.perMessageBurnLimitList = message.perMessageBurnLimitList.map(e => e ? PerMessageBurnLimit.toJSON(e) : undefined);
    } else {
      obj.perMessageBurnLimitList = [];
    }
    message.burningAndMintingPaused !== undefined && (obj.burningAndMintingPaused = message.burningAndMintingPaused ? BurningAndMintingPaused.toJSON(message.burningAndMintingPaused) : undefined);
    message.sendingAndReceivingMessagesPaused !== undefined && (obj.sendingAndReceivingMessagesPaused = message.sendingAndReceivingMessagesPaused ? SendingAndReceivingMessagesPaused.toJSON(message.sendingAndReceivingMessagesPaused) : undefined);
    message.maxMessageBodySize !== undefined && (obj.maxMessageBodySize = message.maxMessageBodySize ? MaxMessageBodySize.toJSON(message.maxMessageBodySize) : undefined);
    message.nextAvailableNonce !== undefined && (obj.nextAvailableNonce = message.nextAvailableNonce ? Nonce.toJSON(message.nextAvailableNonce) : undefined);
    message.signatureThreshold !== undefined && (obj.signatureThreshold = message.signatureThreshold ? SignatureThreshold.toJSON(message.signatureThreshold) : undefined);
    if (message.tokenPairList) {
      obj.tokenPairList = message.tokenPairList.map(e => e ? TokenPair.toJSON(e) : undefined);
    } else {
      obj.tokenPairList = [];
    }
    if (message.usedNoncesList) {
      obj.usedNoncesList = message.usedNoncesList.map(e => e ? Nonce.toJSON(e) : undefined);
    } else {
      obj.usedNoncesList = [];
    }
    if (message.tokenMessengerList) {
      obj.tokenMessengerList = message.tokenMessengerList.map(e => e ? RemoteTokenMessenger.toJSON(e) : undefined);
    } else {
      obj.tokenMessengerList = [];
    }
    return obj;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.owner = object.owner ?? "";
    message.attesterManager = object.attesterManager ?? "";
    message.pauser = object.pauser ?? "";
    message.tokenController = object.tokenController ?? "";
    message.attesterList = object.attesterList?.map(e => Attester.fromPartial(e)) || [];
    message.perMessageBurnLimitList = object.perMessageBurnLimitList?.map(e => PerMessageBurnLimit.fromPartial(e)) || [];
    message.burningAndMintingPaused = object.burningAndMintingPaused !== undefined && object.burningAndMintingPaused !== null ? BurningAndMintingPaused.fromPartial(object.burningAndMintingPaused) : undefined;
    message.sendingAndReceivingMessagesPaused = object.sendingAndReceivingMessagesPaused !== undefined && object.sendingAndReceivingMessagesPaused !== null ? SendingAndReceivingMessagesPaused.fromPartial(object.sendingAndReceivingMessagesPaused) : undefined;
    message.maxMessageBodySize = object.maxMessageBodySize !== undefined && object.maxMessageBodySize !== null ? MaxMessageBodySize.fromPartial(object.maxMessageBodySize) : undefined;
    message.nextAvailableNonce = object.nextAvailableNonce !== undefined && object.nextAvailableNonce !== null ? Nonce.fromPartial(object.nextAvailableNonce) : undefined;
    message.signatureThreshold = object.signatureThreshold !== undefined && object.signatureThreshold !== null ? SignatureThreshold.fromPartial(object.signatureThreshold) : undefined;
    message.tokenPairList = object.tokenPairList?.map(e => TokenPair.fromPartial(e)) || [];
    message.usedNoncesList = object.usedNoncesList?.map(e => Nonce.fromPartial(e)) || [];
    message.tokenMessengerList = object.tokenMessengerList?.map(e => RemoteTokenMessenger.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    }
    if (object.attester_manager !== undefined && object.attester_manager !== null) {
      message.attesterManager = object.attester_manager;
    }
    if (object.pauser !== undefined && object.pauser !== null) {
      message.pauser = object.pauser;
    }
    if (object.token_controller !== undefined && object.token_controller !== null) {
      message.tokenController = object.token_controller;
    }
    message.attesterList = object.attester_list?.map(e => Attester.fromAmino(e)) || [];
    message.perMessageBurnLimitList = object.per_message_burn_limit_list?.map(e => PerMessageBurnLimit.fromAmino(e)) || [];
    if (object.burning_and_minting_paused !== undefined && object.burning_and_minting_paused !== null) {
      message.burningAndMintingPaused = BurningAndMintingPaused.fromAmino(object.burning_and_minting_paused);
    }
    if (object.sending_and_receiving_messages_paused !== undefined && object.sending_and_receiving_messages_paused !== null) {
      message.sendingAndReceivingMessagesPaused = SendingAndReceivingMessagesPaused.fromAmino(object.sending_and_receiving_messages_paused);
    }
    if (object.max_message_body_size !== undefined && object.max_message_body_size !== null) {
      message.maxMessageBodySize = MaxMessageBodySize.fromAmino(object.max_message_body_size);
    }
    if (object.next_available_nonce !== undefined && object.next_available_nonce !== null) {
      message.nextAvailableNonce = Nonce.fromAmino(object.next_available_nonce);
    }
    if (object.signature_threshold !== undefined && object.signature_threshold !== null) {
      message.signatureThreshold = SignatureThreshold.fromAmino(object.signature_threshold);
    }
    message.tokenPairList = object.token_pair_list?.map(e => TokenPair.fromAmino(e)) || [];
    message.usedNoncesList = object.used_nonces_list?.map(e => Nonce.fromAmino(e)) || [];
    message.tokenMessengerList = object.token_messenger_list?.map(e => RemoteTokenMessenger.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.owner = message.owner === "" ? undefined : message.owner;
    obj.attester_manager = message.attesterManager === "" ? undefined : message.attesterManager;
    obj.pauser = message.pauser === "" ? undefined : message.pauser;
    obj.token_controller = message.tokenController === "" ? undefined : message.tokenController;
    if (message.attesterList) {
      obj.attester_list = message.attesterList.map(e => e ? Attester.toAmino(e) : undefined);
    } else {
      obj.attester_list = message.attesterList;
    }
    if (message.perMessageBurnLimitList) {
      obj.per_message_burn_limit_list = message.perMessageBurnLimitList.map(e => e ? PerMessageBurnLimit.toAmino(e) : undefined);
    } else {
      obj.per_message_burn_limit_list = message.perMessageBurnLimitList;
    }
    obj.burning_and_minting_paused = message.burningAndMintingPaused ? BurningAndMintingPaused.toAmino(message.burningAndMintingPaused) : undefined;
    obj.sending_and_receiving_messages_paused = message.sendingAndReceivingMessagesPaused ? SendingAndReceivingMessagesPaused.toAmino(message.sendingAndReceivingMessagesPaused) : undefined;
    obj.max_message_body_size = message.maxMessageBodySize ? MaxMessageBodySize.toAmino(message.maxMessageBodySize) : undefined;
    obj.next_available_nonce = message.nextAvailableNonce ? Nonce.toAmino(message.nextAvailableNonce) : undefined;
    obj.signature_threshold = message.signatureThreshold ? SignatureThreshold.toAmino(message.signatureThreshold) : undefined;
    if (message.tokenPairList) {
      obj.token_pair_list = message.tokenPairList.map(e => e ? TokenPair.toAmino(e) : undefined);
    } else {
      obj.token_pair_list = message.tokenPairList;
    }
    if (message.usedNoncesList) {
      obj.used_nonces_list = message.usedNoncesList.map(e => e ? Nonce.toAmino(e) : undefined);
    } else {
      obj.used_nonces_list = message.usedNoncesList;
    }
    if (message.tokenMessengerList) {
      obj.token_messenger_list = message.tokenMessengerList.map(e => e ? RemoteTokenMessenger.toAmino(e) : undefined);
    } else {
      obj.token_messenger_list = message.tokenMessengerList;
    }
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/circle.cctp.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};