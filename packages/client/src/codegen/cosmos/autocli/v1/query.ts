//@ts-nocheck
import { ModuleOptions, ModuleOptionsAmino, ModuleOptionsSDKType } from "./options";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
import { isSet, isObject } from "../../../helpers";
/** AppOptionsRequest is the RemoteInfoService/AppOptions request type. */
export interface AppOptionsRequest {}
export interface AppOptionsRequestProtoMsg {
  typeUrl: "/cosmos.autocli.v1.AppOptionsRequest";
  value: Uint8Array;
}
/** AppOptionsRequest is the RemoteInfoService/AppOptions request type. */
export interface AppOptionsRequestAmino {}
export interface AppOptionsRequestAminoMsg {
  type: "cosmos-sdk/AppOptionsRequest";
  value: AppOptionsRequestAmino;
}
/** AppOptionsRequest is the RemoteInfoService/AppOptions request type. */
export interface AppOptionsRequestSDKType {}
export interface AppOptionsResponse_ModuleOptionsEntry {
  key: string;
  value?: ModuleOptions;
}
export interface AppOptionsResponse_ModuleOptionsEntryProtoMsg {
  typeUrl: string;
  value: Uint8Array;
}
export interface AppOptionsResponse_ModuleOptionsEntryAmino {
  key?: string;
  value?: ModuleOptionsAmino;
}
export interface AppOptionsResponse_ModuleOptionsEntryAminoMsg {
  type: string;
  value: AppOptionsResponse_ModuleOptionsEntryAmino;
}
export interface AppOptionsResponse_ModuleOptionsEntrySDKType {
  key: string;
  value?: ModuleOptionsSDKType;
}
/** AppOptionsResponse is the RemoteInfoService/AppOptions response type. */
export interface AppOptionsResponse {
  /** module_options is a map of module name to autocli module options. */
  moduleOptions: {
    [key: string]: ModuleOptions;
  };
}
export interface AppOptionsResponseProtoMsg {
  typeUrl: "/cosmos.autocli.v1.AppOptionsResponse";
  value: Uint8Array;
}
/** AppOptionsResponse is the RemoteInfoService/AppOptions response type. */
export interface AppOptionsResponseAmino {
  /** module_options is a map of module name to autocli module options. */
  module_options?: {
    [key: string]: ModuleOptionsAmino;
  };
}
export interface AppOptionsResponseAminoMsg {
  type: "cosmos-sdk/AppOptionsResponse";
  value: AppOptionsResponseAmino;
}
/** AppOptionsResponse is the RemoteInfoService/AppOptions response type. */
export interface AppOptionsResponseSDKType {
  module_options: {
    [key: string]: ModuleOptionsSDKType;
  };
}
function createBaseAppOptionsRequest(): AppOptionsRequest {
  return {};
}
export const AppOptionsRequest = {
  typeUrl: "/cosmos.autocli.v1.AppOptionsRequest",
  encode(_: AppOptionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): AppOptionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppOptionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): AppOptionsRequest {
    return {};
  },
  toJSON(_: AppOptionsRequest): JsonSafe<AppOptionsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<AppOptionsRequest>): AppOptionsRequest {
    const message = createBaseAppOptionsRequest();
    return message;
  },
  fromAmino(_: AppOptionsRequestAmino): AppOptionsRequest {
    const message = createBaseAppOptionsRequest();
    return message;
  },
  toAmino(_: AppOptionsRequest): AppOptionsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: AppOptionsRequestAminoMsg): AppOptionsRequest {
    return AppOptionsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: AppOptionsRequest): AppOptionsRequestAminoMsg {
    return {
      type: "cosmos-sdk/AppOptionsRequest",
      value: AppOptionsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: AppOptionsRequestProtoMsg): AppOptionsRequest {
    return AppOptionsRequest.decode(message.value);
  },
  toProto(message: AppOptionsRequest): Uint8Array {
    return AppOptionsRequest.encode(message).finish();
  },
  toProtoMsg(message: AppOptionsRequest): AppOptionsRequestProtoMsg {
    return {
      typeUrl: "/cosmos.autocli.v1.AppOptionsRequest",
      value: AppOptionsRequest.encode(message).finish()
    };
  }
};
function createBaseAppOptionsResponse_ModuleOptionsEntry(): AppOptionsResponse_ModuleOptionsEntry {
  return {
    key: "",
    value: undefined
  };
}
export const AppOptionsResponse_ModuleOptionsEntry = {
  encode(message: AppOptionsResponse_ModuleOptionsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ModuleOptions.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): AppOptionsResponse_ModuleOptionsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppOptionsResponse_ModuleOptionsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = ModuleOptions.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AppOptionsResponse_ModuleOptionsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ModuleOptions.fromJSON(object.value) : undefined
    };
  },
  toJSON(message: AppOptionsResponse_ModuleOptionsEntry): JsonSafe<AppOptionsResponse_ModuleOptionsEntry> {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? ModuleOptions.toJSON(message.value) : undefined);
    return obj;
  },
  fromPartial(object: Partial<AppOptionsResponse_ModuleOptionsEntry>): AppOptionsResponse_ModuleOptionsEntry {
    const message = createBaseAppOptionsResponse_ModuleOptionsEntry();
    message.key = object.key ?? "";
    message.value = object.value !== undefined && object.value !== null ? ModuleOptions.fromPartial(object.value) : undefined;
    return message;
  },
  fromAmino(object: AppOptionsResponse_ModuleOptionsEntryAmino): AppOptionsResponse_ModuleOptionsEntry {
    const message = createBaseAppOptionsResponse_ModuleOptionsEntry();
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = ModuleOptions.fromAmino(object.value);
    }
    return message;
  },
  toAmino(message: AppOptionsResponse_ModuleOptionsEntry): AppOptionsResponse_ModuleOptionsEntryAmino {
    const obj: any = {};
    obj.key = message.key === "" ? undefined : message.key;
    obj.value = message.value ? ModuleOptions.toAmino(message.value) : undefined;
    return obj;
  },
  fromAminoMsg(object: AppOptionsResponse_ModuleOptionsEntryAminoMsg): AppOptionsResponse_ModuleOptionsEntry {
    return AppOptionsResponse_ModuleOptionsEntry.fromAmino(object.value);
  },
  fromProtoMsg(message: AppOptionsResponse_ModuleOptionsEntryProtoMsg): AppOptionsResponse_ModuleOptionsEntry {
    return AppOptionsResponse_ModuleOptionsEntry.decode(message.value);
  },
  toProto(message: AppOptionsResponse_ModuleOptionsEntry): Uint8Array {
    return AppOptionsResponse_ModuleOptionsEntry.encode(message).finish();
  }
};
function createBaseAppOptionsResponse(): AppOptionsResponse {
  return {
    moduleOptions: {}
  };
}
export const AppOptionsResponse = {
  typeUrl: "/cosmos.autocli.v1.AppOptionsResponse",
  encode(message: AppOptionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.moduleOptions).forEach(([key, value]) => {
      AppOptionsResponse_ModuleOptionsEntry.encode({
        key: (key as any),
        value
      }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): AppOptionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppOptionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = AppOptionsResponse_ModuleOptionsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.moduleOptions[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): AppOptionsResponse {
    return {
      moduleOptions: isObject(object.moduleOptions) ? Object.entries(object.moduleOptions).reduce<{
        [key: string]: ModuleOptions;
      }>((acc, [key, value]) => {
        acc[key] = ModuleOptions.fromJSON(value);
        return acc;
      }, {}) : {}
    };
  },
  toJSON(message: AppOptionsResponse): JsonSafe<AppOptionsResponse> {
    const obj: any = {};
    obj.moduleOptions = {};
    if (message.moduleOptions) {
      Object.entries(message.moduleOptions).forEach(([k, v]) => {
        obj.moduleOptions[k] = ModuleOptions.toJSON(v);
      });
    }
    return obj;
  },
  fromPartial(object: Partial<AppOptionsResponse>): AppOptionsResponse {
    const message = createBaseAppOptionsResponse();
    message.moduleOptions = Object.entries(object.moduleOptions ?? {}).reduce<{
      [key: string]: ModuleOptions;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = ModuleOptions.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
  fromAmino(object: AppOptionsResponseAmino): AppOptionsResponse {
    const message = createBaseAppOptionsResponse();
    message.moduleOptions = Object.entries(object.module_options ?? {}).reduce<{
      [key: string]: ModuleOptions;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = ModuleOptions.fromAmino(value);
      }
      return acc;
    }, {});
    return message;
  },
  toAmino(message: AppOptionsResponse): AppOptionsResponseAmino {
    const obj: any = {};
    obj.module_options = {};
    if (message.moduleOptions) {
      Object.entries(message.moduleOptions).forEach(([k, v]) => {
        obj.module_options[k] = ModuleOptions.toAmino(v);
      });
    }
    return obj;
  },
  fromAminoMsg(object: AppOptionsResponseAminoMsg): AppOptionsResponse {
    return AppOptionsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: AppOptionsResponse): AppOptionsResponseAminoMsg {
    return {
      type: "cosmos-sdk/AppOptionsResponse",
      value: AppOptionsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: AppOptionsResponseProtoMsg): AppOptionsResponse {
    return AppOptionsResponse.decode(message.value);
  },
  toProto(message: AppOptionsResponse): Uint8Array {
    return AppOptionsResponse.encode(message).finish();
  },
  toProtoMsg(message: AppOptionsResponse): AppOptionsResponseProtoMsg {
    return {
      typeUrl: "/cosmos.autocli.v1.AppOptionsResponse",
      value: AppOptionsResponse.encode(message).finish()
    };
  }
};