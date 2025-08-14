//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet, bytesFromBase64, base64FromBytes } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
export enum ScalarType {
  SCALAR_TYPE_UNSPECIFIED = 0,
  SCALAR_TYPE_STRING = 1,
  SCALAR_TYPE_BYTES = 2,
  UNRECOGNIZED = -1,
}
export const ScalarTypeSDKType = ScalarType;
export const ScalarTypeAmino = ScalarType;
export function scalarTypeFromJSON(object: any): ScalarType {
  switch (object) {
    case 0:
    case "SCALAR_TYPE_UNSPECIFIED":
      return ScalarType.SCALAR_TYPE_UNSPECIFIED;
    case 1:
    case "SCALAR_TYPE_STRING":
      return ScalarType.SCALAR_TYPE_STRING;
    case 2:
    case "SCALAR_TYPE_BYTES":
      return ScalarType.SCALAR_TYPE_BYTES;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ScalarType.UNRECOGNIZED;
  }
}
export function scalarTypeToJSON(object: ScalarType): string {
  switch (object) {
    case ScalarType.SCALAR_TYPE_UNSPECIFIED:
      return "SCALAR_TYPE_UNSPECIFIED";
    case ScalarType.SCALAR_TYPE_STRING:
      return "SCALAR_TYPE_STRING";
    case ScalarType.SCALAR_TYPE_BYTES:
      return "SCALAR_TYPE_BYTES";
    case ScalarType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/** MsgExecute is the message to execute the given module function */
export interface MsgExecute {
  /** Sender is the that actor that signed the messages */
  sender: string;
  /** ModuleAddr is the address of the module deployer */
  moduleAddress: string;
  /** ModuleName is the name of module to execute */
  moduleName: string;
  /** FunctionName is the name of a function to execute */
  functionName: string;
  /**
   * TypeArgs is the type arguments of a function to execute
   * ex) "0x1::BasicCoin::Initia", "bool", "u8", "u64"
   */
  typeArgs: string[];
  /**
   * Args is the arguments of a function to execute
   * - number: little endian
   * - string: base64 bytes
   */
  args: Uint8Array[];
}
export interface MsgExecuteProtoMsg {
  typeUrl: "/initia.move.v1.MsgExecute";
  value: Uint8Array;
}
/** MsgExecute is the message to execute the given module function */
export interface MsgExecuteAmino {
  /** Sender is the that actor that signed the messages */
  sender?: string;
  /** ModuleAddr is the address of the module deployer */
  module_address?: string;
  /** ModuleName is the name of module to execute */
  module_name?: string;
  /** FunctionName is the name of a function to execute */
  function_name?: string;
  /**
   * TypeArgs is the type arguments of a function to execute
   * ex) "0x1::BasicCoin::Initia", "bool", "u8", "u64"
   */
  type_args?: string[];
  /**
   * Args is the arguments of a function to execute
   * - number: little endian
   * - string: base64 bytes
   */
  args?: string[];
}
export interface MsgExecuteAminoMsg {
  type: "/initia.move.v1.MsgExecute";
  value: MsgExecuteAmino;
}
/** MsgExecute is the message to execute the given module function */
export interface MsgExecuteSDKType {
  sender: string;
  module_address: string;
  module_name: string;
  function_name: string;
  type_args: string[];
  args: Uint8Array[];
}
/** MsgExecuteResponse returns execution result data. */
export interface MsgExecuteResponse {}
export interface MsgExecuteResponseProtoMsg {
  typeUrl: "/initia.move.v1.MsgExecuteResponse";
  value: Uint8Array;
}
/** MsgExecuteResponse returns execution result data. */
export interface MsgExecuteResponseAmino {}
export interface MsgExecuteResponseAminoMsg {
  type: "/initia.move.v1.MsgExecuteResponse";
  value: MsgExecuteResponseAmino;
}
/** MsgExecuteResponse returns execution result data. */
export interface MsgExecuteResponseSDKType {}
/**
 * InterfaceDescriptor describes an interface type to be used with
 * accepts_interface and implements_interface and declared by declare_interface.
 */
export interface InterfaceDescriptor {
  /**
   * name is the name of the interface. It should be a short-name (without
   * a period) such that the fully qualified name of the interface will be
   * package.name, ex. for the package a.b and interface named C, the
   * fully-qualified name will be a.b.C.
   */
  name: string;
  /**
   * description is a human-readable description of the interface and its
   * purpose.
   */
  description: string;
}
export interface InterfaceDescriptorProtoMsg {
  typeUrl: "/initia.move.v1.InterfaceDescriptor";
  value: Uint8Array;
}
/**
 * InterfaceDescriptor describes an interface type to be used with
 * accepts_interface and implements_interface and declared by declare_interface.
 */
export interface InterfaceDescriptorAmino {
  /**
   * name is the name of the interface. It should be a short-name (without
   * a period) such that the fully qualified name of the interface will be
   * package.name, ex. for the package a.b and interface named C, the
   * fully-qualified name will be a.b.C.
   */
  name?: string;
  /**
   * description is a human-readable description of the interface and its
   * purpose.
   */
  description?: string;
}
export interface InterfaceDescriptorAminoMsg {
  type: "/initia.move.v1.InterfaceDescriptor";
  value: InterfaceDescriptorAmino;
}
/**
 * InterfaceDescriptor describes an interface type to be used with
 * accepts_interface and implements_interface and declared by declare_interface.
 */
export interface InterfaceDescriptorSDKType {
  name: string;
  description: string;
}
/**
 * ScalarDescriptor describes an scalar type to be used with
 * the scalar field option and declared by declare_scalar.
 * Scalars extend simple protobuf built-in types with additional
 * syntax and semantics, for instance to represent big integers.
 * Scalars should ideally define an encoding such that there is only one
 * valid syntactical representation for a given semantic meaning,
 * i.e. the encoding should be deterministic.
 */
export interface ScalarDescriptor {
  /**
   * name is the name of the scalar. It should be a short-name (without
   * a period) such that the fully qualified name of the scalar will be
   * package.name, ex. for the package a.b and scalar named C, the
   * fully-qualified name will be a.b.C.
   */
  name: string;
  /**
   * description is a human-readable description of the scalar and its
   * encoding format. For instance a big integer or decimal scalar should
   * specify precisely the expected encoding format.
   */
  description: string;
  /**
   * field_type is the type of field with which this scalar can be used.
   * Scalars can be used with one and only one type of field so that
   * encoding standards and simple and clear. Currently only string and
   * bytes fields are supported for scalars.
   */
  fieldType: ScalarType[];
}
export interface ScalarDescriptorProtoMsg {
  typeUrl: "/initia.move.v1.ScalarDescriptor";
  value: Uint8Array;
}
/**
 * ScalarDescriptor describes an scalar type to be used with
 * the scalar field option and declared by declare_scalar.
 * Scalars extend simple protobuf built-in types with additional
 * syntax and semantics, for instance to represent big integers.
 * Scalars should ideally define an encoding such that there is only one
 * valid syntactical representation for a given semantic meaning,
 * i.e. the encoding should be deterministic.
 */
export interface ScalarDescriptorAmino {
  /**
   * name is the name of the scalar. It should be a short-name (without
   * a period) such that the fully qualified name of the scalar will be
   * package.name, ex. for the package a.b and scalar named C, the
   * fully-qualified name will be a.b.C.
   */
  name?: string;
  /**
   * description is a human-readable description of the scalar and its
   * encoding format. For instance a big integer or decimal scalar should
   * specify precisely the expected encoding format.
   */
  description?: string;
  /**
   * field_type is the type of field with which this scalar can be used.
   * Scalars can be used with one and only one type of field so that
   * encoding standards and simple and clear. Currently only string and
   * bytes fields are supported for scalars.
   */
  field_type?: ScalarType[];
}
export interface ScalarDescriptorAminoMsg {
  type: "/initia.move.v1.ScalarDescriptor";
  value: ScalarDescriptorAmino;
}
/**
 * ScalarDescriptor describes an scalar type to be used with
 * the scalar field option and declared by declare_scalar.
 * Scalars extend simple protobuf built-in types with additional
 * syntax and semantics, for instance to represent big integers.
 * Scalars should ideally define an encoding such that there is only one
 * valid syntactical representation for a given semantic meaning,
 * i.e. the encoding should be deterministic.
 */
export interface ScalarDescriptorSDKType {
  name: string;
  description: string;
  field_type: ScalarType[];
}
function createBaseMsgExecute(): MsgExecute {
  return {
    sender: "",
    moduleAddress: "",
    moduleName: "",
    functionName: "",
    typeArgs: [],
    args: []
  };
}
export const MsgExecute = {
  typeUrl: "/initia.move.v1.MsgExecute",
  encode(message: MsgExecute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.moduleAddress !== "") {
      writer.uint32(18).string(message.moduleAddress);
    }
    if (message.moduleName !== "") {
      writer.uint32(26).string(message.moduleName);
    }
    if (message.functionName !== "") {
      writer.uint32(34).string(message.functionName);
    }
    for (const v of message.typeArgs) {
      writer.uint32(42).string(v!);
    }
    for (const v of message.args) {
      writer.uint32(50).bytes(v!);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExecute {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExecute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.moduleAddress = reader.string();
          break;
        case 3:
          message.moduleName = reader.string();
          break;
        case 4:
          message.functionName = reader.string();
          break;
        case 5:
          message.typeArgs.push(reader.string());
          break;
        case 6:
          message.args.push(reader.bytes());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgExecute {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      moduleAddress: isSet(object.moduleAddress) ? String(object.moduleAddress) : "",
      moduleName: isSet(object.moduleName) ? String(object.moduleName) : "",
      functionName: isSet(object.functionName) ? String(object.functionName) : "",
      typeArgs: Array.isArray(object?.typeArgs) ? object.typeArgs.map((e: any) => String(e)) : [],
      args: Array.isArray(object?.args) ? object.args.map((e: any) => bytesFromBase64(e)) : []
    };
  },
  toJSON(message: MsgExecute): JsonSafe<MsgExecute> {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.moduleAddress !== undefined && (obj.moduleAddress = message.moduleAddress);
    message.moduleName !== undefined && (obj.moduleName = message.moduleName);
    message.functionName !== undefined && (obj.functionName = message.functionName);
    if (message.typeArgs) {
      obj.typeArgs = message.typeArgs.map(e => e);
    } else {
      obj.typeArgs = [];
    }
    if (message.args) {
      obj.args = message.args.map(e => base64FromBytes(e !== undefined ? e : new Uint8Array()));
    } else {
      obj.args = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgExecute>): MsgExecute {
    const message = createBaseMsgExecute();
    message.sender = object.sender ?? "";
    message.moduleAddress = object.moduleAddress ?? "";
    message.moduleName = object.moduleName ?? "";
    message.functionName = object.functionName ?? "";
    message.typeArgs = object.typeArgs?.map(e => e) || [];
    message.args = object.args?.map(e => e) || [];
    return message;
  },
  fromAmino(object: MsgExecuteAmino): MsgExecute {
    const message = createBaseMsgExecute();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    if (object.module_address !== undefined && object.module_address !== null) {
      message.moduleAddress = object.module_address;
    }
    if (object.module_name !== undefined && object.module_name !== null) {
      message.moduleName = object.module_name;
    }
    if (object.function_name !== undefined && object.function_name !== null) {
      message.functionName = object.function_name;
    }
    message.typeArgs = object.type_args?.map(e => e) || [];
    message.args = object.args?.map(e => bytesFromBase64(e)) || [];
    return message;
  },
  toAmino(message: MsgExecute): MsgExecuteAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    obj.module_address = message.moduleAddress === "" ? undefined : message.moduleAddress;
    obj.module_name = message.moduleName === "" ? undefined : message.moduleName;
    obj.function_name = message.functionName === "" ? undefined : message.functionName;
    if (message.typeArgs) {
      obj.type_args = message.typeArgs.map(e => e);
    } else {
      obj.type_args = message.typeArgs;
    }
    if (message.args) {
      obj.args = message.args.map(e => base64FromBytes(e));
    } else {
      obj.args = message.args;
    }
    return obj;
  },
  fromAminoMsg(object: MsgExecuteAminoMsg): MsgExecute {
    return MsgExecute.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgExecuteProtoMsg): MsgExecute {
    return MsgExecute.decode(message.value);
  },
  toProto(message: MsgExecute): Uint8Array {
    return MsgExecute.encode(message).finish();
  },
  toProtoMsg(message: MsgExecute): MsgExecuteProtoMsg {
    return {
      typeUrl: "/initia.move.v1.MsgExecute",
      value: MsgExecute.encode(message).finish()
    };
  }
};
function createBaseMsgExecuteResponse(): MsgExecuteResponse {
  return {};
}
export const MsgExecuteResponse = {
  typeUrl: "/initia.move.v1.MsgExecuteResponse",
  encode(_: MsgExecuteResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExecuteResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExecuteResponse();
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
  fromJSON(_: any): MsgExecuteResponse {
    return {};
  },
  toJSON(_: MsgExecuteResponse): JsonSafe<MsgExecuteResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgExecuteResponse>): MsgExecuteResponse {
    const message = createBaseMsgExecuteResponse();
    return message;
  },
  fromAmino(_: MsgExecuteResponseAmino): MsgExecuteResponse {
    const message = createBaseMsgExecuteResponse();
    return message;
  },
  toAmino(_: MsgExecuteResponse): MsgExecuteResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgExecuteResponseAminoMsg): MsgExecuteResponse {
    return MsgExecuteResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgExecuteResponseProtoMsg): MsgExecuteResponse {
    return MsgExecuteResponse.decode(message.value);
  },
  toProto(message: MsgExecuteResponse): Uint8Array {
    return MsgExecuteResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgExecuteResponse): MsgExecuteResponseProtoMsg {
    return {
      typeUrl: "/initia.move.v1.MsgExecuteResponse",
      value: MsgExecuteResponse.encode(message).finish()
    };
  }
};
function createBaseInterfaceDescriptor(): InterfaceDescriptor {
  return {
    name: "",
    description: ""
  };
}
export const InterfaceDescriptor = {
  typeUrl: "/initia.move.v1.InterfaceDescriptor",
  encode(message: InterfaceDescriptor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): InterfaceDescriptor {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInterfaceDescriptor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): InterfaceDescriptor {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : ""
    };
  },
  toJSON(message: InterfaceDescriptor): JsonSafe<InterfaceDescriptor> {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },
  fromPartial(object: Partial<InterfaceDescriptor>): InterfaceDescriptor {
    const message = createBaseInterfaceDescriptor();
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    return message;
  },
  fromAmino(object: InterfaceDescriptorAmino): InterfaceDescriptor {
    const message = createBaseInterfaceDescriptor();
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    return message;
  },
  toAmino(message: InterfaceDescriptor): InterfaceDescriptorAmino {
    const obj: any = {};
    obj.name = message.name === "" ? undefined : message.name;
    obj.description = message.description === "" ? undefined : message.description;
    return obj;
  },
  fromAminoMsg(object: InterfaceDescriptorAminoMsg): InterfaceDescriptor {
    return InterfaceDescriptor.fromAmino(object.value);
  },
  fromProtoMsg(message: InterfaceDescriptorProtoMsg): InterfaceDescriptor {
    return InterfaceDescriptor.decode(message.value);
  },
  toProto(message: InterfaceDescriptor): Uint8Array {
    return InterfaceDescriptor.encode(message).finish();
  },
  toProtoMsg(message: InterfaceDescriptor): InterfaceDescriptorProtoMsg {
    return {
      typeUrl: "/initia.move.v1.InterfaceDescriptor",
      value: InterfaceDescriptor.encode(message).finish()
    };
  }
};
function createBaseScalarDescriptor(): ScalarDescriptor {
  return {
    name: "",
    description: "",
    fieldType: []
  };
}
export const ScalarDescriptor = {
  typeUrl: "/initia.move.v1.ScalarDescriptor",
  encode(message: ScalarDescriptor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    writer.uint32(26).fork();
    for (const v of message.fieldType) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): ScalarDescriptor {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseScalarDescriptor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.fieldType.push(reader.int32() as any);
            }
          } else {
            message.fieldType.push(reader.int32() as any);
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ScalarDescriptor {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      fieldType: Array.isArray(object?.fieldType) ? object.fieldType.map((e: any) => scalarTypeFromJSON(e)) : []
    };
  },
  toJSON(message: ScalarDescriptor): JsonSafe<ScalarDescriptor> {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    if (message.fieldType) {
      obj.fieldType = message.fieldType.map(e => scalarTypeToJSON(e));
    } else {
      obj.fieldType = [];
    }
    return obj;
  },
  fromPartial(object: Partial<ScalarDescriptor>): ScalarDescriptor {
    const message = createBaseScalarDescriptor();
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.fieldType = object.fieldType?.map(e => e) || [];
    return message;
  },
  fromAmino(object: ScalarDescriptorAmino): ScalarDescriptor {
    const message = createBaseScalarDescriptor();
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    message.fieldType = object.field_type?.map(e => e) || [];
    return message;
  },
  toAmino(message: ScalarDescriptor): ScalarDescriptorAmino {
    const obj: any = {};
    obj.name = message.name === "" ? undefined : message.name;
    obj.description = message.description === "" ? undefined : message.description;
    if (message.fieldType) {
      obj.field_type = message.fieldType.map(e => e);
    } else {
      obj.field_type = message.fieldType;
    }
    return obj;
  },
  fromAminoMsg(object: ScalarDescriptorAminoMsg): ScalarDescriptor {
    return ScalarDescriptor.fromAmino(object.value);
  },
  fromProtoMsg(message: ScalarDescriptorProtoMsg): ScalarDescriptor {
    return ScalarDescriptor.decode(message.value);
  },
  toProto(message: ScalarDescriptor): Uint8Array {
    return ScalarDescriptor.encode(message).finish();
  },
  toProtoMsg(message: ScalarDescriptor): ScalarDescriptorProtoMsg {
    return {
      typeUrl: "/initia.move.v1.ScalarDescriptor",
      value: ScalarDescriptor.encode(message).finish()
    };
  }
};