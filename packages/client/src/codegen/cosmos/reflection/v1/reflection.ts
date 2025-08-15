//@ts-nocheck
import { FileDescriptorProto, FileDescriptorProtoAmino, FileDescriptorProtoSDKType } from "../../../google/protobuf/descriptor";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/** FileDescriptorsRequest is the Query/FileDescriptors request type. */
export interface FileDescriptorsRequest {}
export interface FileDescriptorsRequestProtoMsg {
  typeUrl: "/cosmos.reflection.v1.FileDescriptorsRequest";
  value: Uint8Array;
}
/**
 * FileDescriptorsRequest is the Query/FileDescriptors request type.
 * @name FileDescriptorsRequestAmino
 * @package cosmos.reflection.v1
 * @see proto type: cosmos.reflection.v1.FileDescriptorsRequest
 */
export interface FileDescriptorsRequestAmino {}
export interface FileDescriptorsRequestAminoMsg {
  type: "cosmos-sdk/FileDescriptorsRequest";
  value: FileDescriptorsRequestAmino;
}
/** FileDescriptorsRequest is the Query/FileDescriptors request type. */
export interface FileDescriptorsRequestSDKType {}
/** FileDescriptorsResponse is the Query/FileDescriptors response type. */
export interface FileDescriptorsResponse {
  /** files is the file descriptors. */
  files: FileDescriptorProto[];
}
export interface FileDescriptorsResponseProtoMsg {
  typeUrl: "/cosmos.reflection.v1.FileDescriptorsResponse";
  value: Uint8Array;
}
/**
 * FileDescriptorsResponse is the Query/FileDescriptors response type.
 * @name FileDescriptorsResponseAmino
 * @package cosmos.reflection.v1
 * @see proto type: cosmos.reflection.v1.FileDescriptorsResponse
 */
export interface FileDescriptorsResponseAmino {
  /**
   * files is the file descriptors.
   */
  files?: FileDescriptorProtoAmino[];
}
export interface FileDescriptorsResponseAminoMsg {
  type: "cosmos-sdk/FileDescriptorsResponse";
  value: FileDescriptorsResponseAmino;
}
/** FileDescriptorsResponse is the Query/FileDescriptors response type. */
export interface FileDescriptorsResponseSDKType {
  files: FileDescriptorProtoSDKType[];
}
function createBaseFileDescriptorsRequest(): FileDescriptorsRequest {
  return {};
}
export const FileDescriptorsRequest = {
  typeUrl: "/cosmos.reflection.v1.FileDescriptorsRequest",
  encode(_: FileDescriptorsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): FileDescriptorsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileDescriptorsRequest();
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
  fromJSON(_: any): FileDescriptorsRequest {
    return {};
  },
  toJSON(_: FileDescriptorsRequest): JsonSafe<FileDescriptorsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<FileDescriptorsRequest>): FileDescriptorsRequest {
    const message = createBaseFileDescriptorsRequest();
    return message;
  },
  fromAmino(_: FileDescriptorsRequestAmino): FileDescriptorsRequest {
    const message = createBaseFileDescriptorsRequest();
    return message;
  },
  toAmino(_: FileDescriptorsRequest): FileDescriptorsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: FileDescriptorsRequestAminoMsg): FileDescriptorsRequest {
    return FileDescriptorsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: FileDescriptorsRequest): FileDescriptorsRequestAminoMsg {
    return {
      type: "cosmos-sdk/FileDescriptorsRequest",
      value: FileDescriptorsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: FileDescriptorsRequestProtoMsg): FileDescriptorsRequest {
    return FileDescriptorsRequest.decode(message.value);
  },
  toProto(message: FileDescriptorsRequest): Uint8Array {
    return FileDescriptorsRequest.encode(message).finish();
  },
  toProtoMsg(message: FileDescriptorsRequest): FileDescriptorsRequestProtoMsg {
    return {
      typeUrl: "/cosmos.reflection.v1.FileDescriptorsRequest",
      value: FileDescriptorsRequest.encode(message).finish()
    };
  }
};
function createBaseFileDescriptorsResponse(): FileDescriptorsResponse {
  return {
    files: []
  };
}
export const FileDescriptorsResponse = {
  typeUrl: "/cosmos.reflection.v1.FileDescriptorsResponse",
  encode(message: FileDescriptorsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.files) {
      FileDescriptorProto.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): FileDescriptorsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileDescriptorsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.files.push(FileDescriptorProto.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): FileDescriptorsResponse {
    return {
      files: Array.isArray(object?.files) ? object.files.map((e: any) => FileDescriptorProto.fromJSON(e)) : []
    };
  },
  toJSON(message: FileDescriptorsResponse): JsonSafe<FileDescriptorsResponse> {
    const obj: any = {};
    if (message.files) {
      obj.files = message.files.map(e => e ? FileDescriptorProto.toJSON(e) : undefined);
    } else {
      obj.files = [];
    }
    return obj;
  },
  fromPartial(object: Partial<FileDescriptorsResponse>): FileDescriptorsResponse {
    const message = createBaseFileDescriptorsResponse();
    message.files = object.files?.map(e => FileDescriptorProto.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: FileDescriptorsResponseAmino): FileDescriptorsResponse {
    const message = createBaseFileDescriptorsResponse();
    message.files = object.files?.map(e => FileDescriptorProto.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: FileDescriptorsResponse): FileDescriptorsResponseAmino {
    const obj: any = {};
    if (message.files) {
      obj.files = message.files.map(e => e ? FileDescriptorProto.toAmino(e) : undefined);
    } else {
      obj.files = message.files;
    }
    return obj;
  },
  fromAminoMsg(object: FileDescriptorsResponseAminoMsg): FileDescriptorsResponse {
    return FileDescriptorsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: FileDescriptorsResponse): FileDescriptorsResponseAminoMsg {
    return {
      type: "cosmos-sdk/FileDescriptorsResponse",
      value: FileDescriptorsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: FileDescriptorsResponseProtoMsg): FileDescriptorsResponse {
    return FileDescriptorsResponse.decode(message.value);
  },
  toProto(message: FileDescriptorsResponse): Uint8Array {
    return FileDescriptorsResponse.encode(message).finish();
  },
  toProtoMsg(message: FileDescriptorsResponse): FileDescriptorsResponseProtoMsg {
    return {
      typeUrl: "/cosmos.reflection.v1.FileDescriptorsResponse",
      value: FileDescriptorsResponse.encode(message).finish()
    };
  }
};