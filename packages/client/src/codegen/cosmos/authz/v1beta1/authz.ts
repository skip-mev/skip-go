//@ts-nocheck
import { Any, AnyAmino, AnySDKType } from "../../../google/protobuf/any";
import { Timestamp } from "../../../google/protobuf/timestamp";
import _m0 from "protobufjs/minimal.js";
import { isSet, toTimestamp, fromTimestamp, fromJsonTimestamp } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * GenericAuthorization gives the grantee unrestricted permissions to execute
 * the provided method on behalf of the granter's account.
 */
export interface GenericAuthorization {
  /** Msg, identified by it's type URL, to grant unrestricted permissions to execute */
  msg: string;
}
export interface GenericAuthorizationProtoMsg {
  typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization";
  value: Uint8Array;
}
/**
 * GenericAuthorization gives the grantee unrestricted permissions to execute
 * the provided method on behalf of the granter's account.
 */
export interface GenericAuthorizationAmino {
  /** Msg, identified by it's type URL, to grant unrestricted permissions to execute */
  msg?: string;
}
export interface GenericAuthorizationAminoMsg {
  type: "cosmos-sdk/GenericAuthorization";
  value: GenericAuthorizationAmino;
}
/**
 * GenericAuthorization gives the grantee unrestricted permissions to execute
 * the provided method on behalf of the granter's account.
 */
export interface GenericAuthorizationSDKType {
  msg: string;
}
/**
 * Grant gives permissions to execute
 * the provide method with expiration time.
 */
export interface Grant {
  authorization?: Any;
  /**
   * time when the grant will expire and will be pruned. If null, then the grant
   * doesn't have a time expiration (other conditions  in `authorization`
   * may apply to invalidate the grant)
   */
  expiration?: Date;
}
export interface GrantProtoMsg {
  typeUrl: "/cosmos.authz.v1beta1.Grant";
  value: Uint8Array;
}
/**
 * Grant gives permissions to execute
 * the provide method with expiration time.
 */
export interface GrantAmino {
  authorization?: AnyAmino;
  /**
   * time when the grant will expire and will be pruned. If null, then the grant
   * doesn't have a time expiration (other conditions  in `authorization`
   * may apply to invalidate the grant)
   */
  expiration?: string;
}
export interface GrantAminoMsg {
  type: "cosmos-sdk/Grant";
  value: GrantAmino;
}
/**
 * Grant gives permissions to execute
 * the provide method with expiration time.
 */
export interface GrantSDKType {
  authorization?: AnySDKType;
  expiration?: Date;
}
/**
 * GrantAuthorization extends a grant with both the addresses of the grantee and granter.
 * It is used in genesis.proto and query.proto
 */
export interface GrantAuthorization {
  granter: string;
  grantee: string;
  authorization?: Any;
  expiration?: Date;
}
export interface GrantAuthorizationProtoMsg {
  typeUrl: "/cosmos.authz.v1beta1.GrantAuthorization";
  value: Uint8Array;
}
/**
 * GrantAuthorization extends a grant with both the addresses of the grantee and granter.
 * It is used in genesis.proto and query.proto
 */
export interface GrantAuthorizationAmino {
  granter?: string;
  grantee?: string;
  authorization?: AnyAmino;
  expiration?: string;
}
export interface GrantAuthorizationAminoMsg {
  type: "cosmos-sdk/GrantAuthorization";
  value: GrantAuthorizationAmino;
}
/**
 * GrantAuthorization extends a grant with both the addresses of the grantee and granter.
 * It is used in genesis.proto and query.proto
 */
export interface GrantAuthorizationSDKType {
  granter: string;
  grantee: string;
  authorization?: AnySDKType;
  expiration?: Date;
}
/** GrantQueueItem contains the list of TypeURL of a sdk.Msg. */
export interface GrantQueueItem {
  /** msg_type_urls contains the list of TypeURL of a sdk.Msg. */
  msgTypeUrls: string[];
}
export interface GrantQueueItemProtoMsg {
  typeUrl: "/cosmos.authz.v1beta1.GrantQueueItem";
  value: Uint8Array;
}
/** GrantQueueItem contains the list of TypeURL of a sdk.Msg. */
export interface GrantQueueItemAmino {
  /** msg_type_urls contains the list of TypeURL of a sdk.Msg. */
  msg_type_urls?: string[];
}
export interface GrantQueueItemAminoMsg {
  type: "cosmos-sdk/GrantQueueItem";
  value: GrantQueueItemAmino;
}
/** GrantQueueItem contains the list of TypeURL of a sdk.Msg. */
export interface GrantQueueItemSDKType {
  msg_type_urls: string[];
}
function createBaseGenericAuthorization(): GenericAuthorization {
  return {
    msg: ""
  };
}
export const GenericAuthorization = {
  typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
  encode(message: GenericAuthorization, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.msg !== "") {
      writer.uint32(10).string(message.msg);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GenericAuthorization {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenericAuthorization();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GenericAuthorization {
    return {
      msg: isSet(object.msg) ? String(object.msg) : ""
    };
  },
  toJSON(message: GenericAuthorization): JsonSafe<GenericAuthorization> {
    const obj: any = {};
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },
  fromPartial(object: Partial<GenericAuthorization>): GenericAuthorization {
    const message = createBaseGenericAuthorization();
    message.msg = object.msg ?? "";
    return message;
  },
  fromAmino(object: GenericAuthorizationAmino): GenericAuthorization {
    const message = createBaseGenericAuthorization();
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = object.msg;
    }
    return message;
  },
  toAmino(message: GenericAuthorization): GenericAuthorizationAmino {
    const obj: any = {};
    obj.msg = message.msg === "" ? undefined : message.msg;
    return obj;
  },
  fromAminoMsg(object: GenericAuthorizationAminoMsg): GenericAuthorization {
    return GenericAuthorization.fromAmino(object.value);
  },
  toAminoMsg(message: GenericAuthorization): GenericAuthorizationAminoMsg {
    return {
      type: "cosmos-sdk/GenericAuthorization",
      value: GenericAuthorization.toAmino(message)
    };
  },
  fromProtoMsg(message: GenericAuthorizationProtoMsg): GenericAuthorization {
    return GenericAuthorization.decode(message.value);
  },
  toProto(message: GenericAuthorization): Uint8Array {
    return GenericAuthorization.encode(message).finish();
  },
  toProtoMsg(message: GenericAuthorization): GenericAuthorizationProtoMsg {
    return {
      typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
      value: GenericAuthorization.encode(message).finish()
    };
  }
};
function createBaseGrant(): Grant {
  return {
    authorization: undefined,
    expiration: undefined
  };
}
export const Grant = {
  typeUrl: "/cosmos.authz.v1beta1.Grant",
  encode(message: Grant, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authorization !== undefined) {
      Any.encode(message.authorization, writer.uint32(10).fork()).ldelim();
    }
    if (message.expiration !== undefined) {
      Timestamp.encode(toTimestamp(message.expiration), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Grant {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGrant();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authorization = Any.decode(reader, reader.uint32());
          break;
        case 2:
          message.expiration = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Grant {
    return {
      authorization: isSet(object.authorization) ? Any.fromJSON(object.authorization) : undefined,
      expiration: isSet(object.expiration) ? fromJsonTimestamp(object.expiration) : undefined
    };
  },
  toJSON(message: Grant): JsonSafe<Grant> {
    const obj: any = {};
    message.authorization !== undefined && (obj.authorization = message.authorization ? Any.toJSON(message.authorization) : undefined);
    message.expiration !== undefined && (obj.expiration = message.expiration.toISOString());
    return obj;
  },
  fromPartial(object: Partial<Grant>): Grant {
    const message = createBaseGrant();
    message.authorization = object.authorization !== undefined && object.authorization !== null ? Any.fromPartial(object.authorization) : undefined;
    message.expiration = object.expiration ?? undefined;
    return message;
  },
  fromAmino(object: GrantAmino): Grant {
    const message = createBaseGrant();
    if (object.authorization !== undefined && object.authorization !== null) {
      message.authorization = Any.fromAmino(object.authorization);
    }
    if (object.expiration !== undefined && object.expiration !== null) {
      message.expiration = fromTimestamp(Timestamp.fromAmino(object.expiration));
    }
    return message;
  },
  toAmino(message: Grant): GrantAmino {
    const obj: any = {};
    obj.authorization = message.authorization ? Any.toAmino(message.authorization) : undefined;
    obj.expiration = message.expiration ? Timestamp.toAmino(toTimestamp(message.expiration)) : undefined;
    return obj;
  },
  fromAminoMsg(object: GrantAminoMsg): Grant {
    return Grant.fromAmino(object.value);
  },
  toAminoMsg(message: Grant): GrantAminoMsg {
    return {
      type: "cosmos-sdk/Grant",
      value: Grant.toAmino(message)
    };
  },
  fromProtoMsg(message: GrantProtoMsg): Grant {
    return Grant.decode(message.value);
  },
  toProto(message: Grant): Uint8Array {
    return Grant.encode(message).finish();
  },
  toProtoMsg(message: Grant): GrantProtoMsg {
    return {
      typeUrl: "/cosmos.authz.v1beta1.Grant",
      value: Grant.encode(message).finish()
    };
  }
};
function createBaseGrantAuthorization(): GrantAuthorization {
  return {
    granter: "",
    grantee: "",
    authorization: undefined,
    expiration: undefined
  };
}
export const GrantAuthorization = {
  typeUrl: "/cosmos.authz.v1beta1.GrantAuthorization",
  encode(message: GrantAuthorization, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.granter !== "") {
      writer.uint32(10).string(message.granter);
    }
    if (message.grantee !== "") {
      writer.uint32(18).string(message.grantee);
    }
    if (message.authorization !== undefined) {
      Any.encode(message.authorization, writer.uint32(26).fork()).ldelim();
    }
    if (message.expiration !== undefined) {
      Timestamp.encode(toTimestamp(message.expiration), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GrantAuthorization {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGrantAuthorization();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.granter = reader.string();
          break;
        case 2:
          message.grantee = reader.string();
          break;
        case 3:
          message.authorization = Any.decode(reader, reader.uint32());
          break;
        case 4:
          message.expiration = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GrantAuthorization {
    return {
      granter: isSet(object.granter) ? String(object.granter) : "",
      grantee: isSet(object.grantee) ? String(object.grantee) : "",
      authorization: isSet(object.authorization) ? Any.fromJSON(object.authorization) : undefined,
      expiration: isSet(object.expiration) ? fromJsonTimestamp(object.expiration) : undefined
    };
  },
  toJSON(message: GrantAuthorization): JsonSafe<GrantAuthorization> {
    const obj: any = {};
    message.granter !== undefined && (obj.granter = message.granter);
    message.grantee !== undefined && (obj.grantee = message.grantee);
    message.authorization !== undefined && (obj.authorization = message.authorization ? Any.toJSON(message.authorization) : undefined);
    message.expiration !== undefined && (obj.expiration = message.expiration.toISOString());
    return obj;
  },
  fromPartial(object: Partial<GrantAuthorization>): GrantAuthorization {
    const message = createBaseGrantAuthorization();
    message.granter = object.granter ?? "";
    message.grantee = object.grantee ?? "";
    message.authorization = object.authorization !== undefined && object.authorization !== null ? Any.fromPartial(object.authorization) : undefined;
    message.expiration = object.expiration ?? undefined;
    return message;
  },
  fromAmino(object: GrantAuthorizationAmino): GrantAuthorization {
    const message = createBaseGrantAuthorization();
    if (object.granter !== undefined && object.granter !== null) {
      message.granter = object.granter;
    }
    if (object.grantee !== undefined && object.grantee !== null) {
      message.grantee = object.grantee;
    }
    if (object.authorization !== undefined && object.authorization !== null) {
      message.authorization = Any.fromAmino(object.authorization);
    }
    if (object.expiration !== undefined && object.expiration !== null) {
      message.expiration = fromTimestamp(Timestamp.fromAmino(object.expiration));
    }
    return message;
  },
  toAmino(message: GrantAuthorization): GrantAuthorizationAmino {
    const obj: any = {};
    obj.granter = message.granter === "" ? undefined : message.granter;
    obj.grantee = message.grantee === "" ? undefined : message.grantee;
    obj.authorization = message.authorization ? Any.toAmino(message.authorization) : undefined;
    obj.expiration = message.expiration ? Timestamp.toAmino(toTimestamp(message.expiration)) : undefined;
    return obj;
  },
  fromAminoMsg(object: GrantAuthorizationAminoMsg): GrantAuthorization {
    return GrantAuthorization.fromAmino(object.value);
  },
  toAminoMsg(message: GrantAuthorization): GrantAuthorizationAminoMsg {
    return {
      type: "cosmos-sdk/GrantAuthorization",
      value: GrantAuthorization.toAmino(message)
    };
  },
  fromProtoMsg(message: GrantAuthorizationProtoMsg): GrantAuthorization {
    return GrantAuthorization.decode(message.value);
  },
  toProto(message: GrantAuthorization): Uint8Array {
    return GrantAuthorization.encode(message).finish();
  },
  toProtoMsg(message: GrantAuthorization): GrantAuthorizationProtoMsg {
    return {
      typeUrl: "/cosmos.authz.v1beta1.GrantAuthorization",
      value: GrantAuthorization.encode(message).finish()
    };
  }
};
function createBaseGrantQueueItem(): GrantQueueItem {
  return {
    msgTypeUrls: []
  };
}
export const GrantQueueItem = {
  typeUrl: "/cosmos.authz.v1beta1.GrantQueueItem",
  encode(message: GrantQueueItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.msgTypeUrls) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GrantQueueItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGrantQueueItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msgTypeUrls.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GrantQueueItem {
    return {
      msgTypeUrls: Array.isArray(object?.msgTypeUrls) ? object.msgTypeUrls.map((e: any) => String(e)) : []
    };
  },
  toJSON(message: GrantQueueItem): JsonSafe<GrantQueueItem> {
    const obj: any = {};
    if (message.msgTypeUrls) {
      obj.msgTypeUrls = message.msgTypeUrls.map(e => e);
    } else {
      obj.msgTypeUrls = [];
    }
    return obj;
  },
  fromPartial(object: Partial<GrantQueueItem>): GrantQueueItem {
    const message = createBaseGrantQueueItem();
    message.msgTypeUrls = object.msgTypeUrls?.map(e => e) || [];
    return message;
  },
  fromAmino(object: GrantQueueItemAmino): GrantQueueItem {
    const message = createBaseGrantQueueItem();
    message.msgTypeUrls = object.msg_type_urls?.map(e => e) || [];
    return message;
  },
  toAmino(message: GrantQueueItem): GrantQueueItemAmino {
    const obj: any = {};
    if (message.msgTypeUrls) {
      obj.msg_type_urls = message.msgTypeUrls.map(e => e);
    } else {
      obj.msg_type_urls = message.msgTypeUrls;
    }
    return obj;
  },
  fromAminoMsg(object: GrantQueueItemAminoMsg): GrantQueueItem {
    return GrantQueueItem.fromAmino(object.value);
  },
  toAminoMsg(message: GrantQueueItem): GrantQueueItemAminoMsg {
    return {
      type: "cosmos-sdk/GrantQueueItem",
      value: GrantQueueItem.toAmino(message)
    };
  },
  fromProtoMsg(message: GrantQueueItemProtoMsg): GrantQueueItem {
    return GrantQueueItem.decode(message.value);
  },
  toProto(message: GrantQueueItem): Uint8Array {
    return GrantQueueItem.encode(message).finish();
  },
  toProtoMsg(message: GrantQueueItem): GrantQueueItemProtoMsg {
    return {
      typeUrl: "/cosmos.authz.v1beta1.GrantQueueItem",
      value: GrantQueueItem.encode(message).finish()
    };
  }
};