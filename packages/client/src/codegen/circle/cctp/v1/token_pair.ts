//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet, bytesFromBase64, base64FromBytes } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * TokenPair is used to look up the Noble token (i.e. "uusdc") from a remote
 * domain token address Multiple remote_domain + remote_token pairs can map to
 * the same local_token
 * 
 * @param remote_domain the remote domain_id corresponding to the token
 * @param remote_token the remote token address
 * @param local_token the corresponding Noble token denom in uunits
 */
export interface TokenPair {
  remoteDomain: number;
  remoteToken: Uint8Array;
  localToken: string;
}
export interface TokenPairProtoMsg {
  typeUrl: "/circle.cctp.v1.TokenPair";
  value: Uint8Array;
}
/**
 * TokenPair is used to look up the Noble token (i.e. "uusdc") from a remote
 * domain token address Multiple remote_domain + remote_token pairs can map to
 * the same local_token
 * 
 * @param remote_domain the remote domain_id corresponding to the token
 * @param remote_token the remote token address
 * @param local_token the corresponding Noble token denom in uunits
 */
export interface TokenPairAmino {
  remote_domain?: number;
  remote_token?: string;
  local_token?: string;
}
export interface TokenPairAminoMsg {
  type: "/circle.cctp.v1.TokenPair";
  value: TokenPairAmino;
}
/**
 * TokenPair is used to look up the Noble token (i.e. "uusdc") from a remote
 * domain token address Multiple remote_domain + remote_token pairs can map to
 * the same local_token
 * 
 * @param remote_domain the remote domain_id corresponding to the token
 * @param remote_token the remote token address
 * @param local_token the corresponding Noble token denom in uunits
 */
export interface TokenPairSDKType {
  remote_domain: number;
  remote_token: Uint8Array;
  local_token: string;
}
function createBaseTokenPair(): TokenPair {
  return {
    remoteDomain: 0,
    remoteToken: new Uint8Array(),
    localToken: ""
  };
}
export const TokenPair = {
  typeUrl: "/circle.cctp.v1.TokenPair",
  encode(message: TokenPair, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.remoteDomain !== 0) {
      writer.uint32(8).uint32(message.remoteDomain);
    }
    if (message.remoteToken.length !== 0) {
      writer.uint32(18).bytes(message.remoteToken);
    }
    if (message.localToken !== "") {
      writer.uint32(26).string(message.localToken);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): TokenPair {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenPair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.remoteDomain = reader.uint32();
          break;
        case 2:
          message.remoteToken = reader.bytes();
          break;
        case 3:
          message.localToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TokenPair {
    return {
      remoteDomain: isSet(object.remoteDomain) ? Number(object.remoteDomain) : 0,
      remoteToken: isSet(object.remoteToken) ? bytesFromBase64(object.remoteToken) : new Uint8Array(),
      localToken: isSet(object.localToken) ? String(object.localToken) : ""
    };
  },
  toJSON(message: TokenPair): JsonSafe<TokenPair> {
    const obj: any = {};
    message.remoteDomain !== undefined && (obj.remoteDomain = Math.round(message.remoteDomain));
    message.remoteToken !== undefined && (obj.remoteToken = base64FromBytes(message.remoteToken !== undefined ? message.remoteToken : new Uint8Array()));
    message.localToken !== undefined && (obj.localToken = message.localToken);
    return obj;
  },
  fromPartial(object: Partial<TokenPair>): TokenPair {
    const message = createBaseTokenPair();
    message.remoteDomain = object.remoteDomain ?? 0;
    message.remoteToken = object.remoteToken ?? new Uint8Array();
    message.localToken = object.localToken ?? "";
    return message;
  },
  fromAmino(object: TokenPairAmino): TokenPair {
    const message = createBaseTokenPair();
    if (object.remote_domain !== undefined && object.remote_domain !== null) {
      message.remoteDomain = object.remote_domain;
    }
    if (object.remote_token !== undefined && object.remote_token !== null) {
      message.remoteToken = bytesFromBase64(object.remote_token);
    }
    if (object.local_token !== undefined && object.local_token !== null) {
      message.localToken = object.local_token;
    }
    return message;
  },
  toAmino(message: TokenPair): TokenPairAmino {
    const obj: any = {};
    obj.remote_domain = message.remoteDomain === 0 ? undefined : message.remoteDomain;
    obj.remote_token = message.remoteToken ? base64FromBytes(message.remoteToken) : undefined;
    obj.local_token = message.localToken === "" ? undefined : message.localToken;
    return obj;
  },
  fromAminoMsg(object: TokenPairAminoMsg): TokenPair {
    return TokenPair.fromAmino(object.value);
  },
  fromProtoMsg(message: TokenPairProtoMsg): TokenPair {
    return TokenPair.decode(message.value);
  },
  toProto(message: TokenPair): Uint8Array {
    return TokenPair.encode(message).finish();
  },
  toProtoMsg(message: TokenPair): TokenPairProtoMsg {
    return {
      typeUrl: "/circle.cctp.v1.TokenPair",
      value: TokenPair.encode(message).finish()
    };
  }
};