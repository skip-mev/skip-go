//@ts-nocheck
import { Any, AnyAmino, AnySDKType } from "../../../google/protobuf/any";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
import { isSet } from "../../../helpers";
/**
 * Config represents the configuration for a Cosmos SDK ABCI app.
 * It is intended that all state machine logic including the version of
 * baseapp and tx handlers (and possibly even Tendermint) that an app needs
 * can be described in a config object. For compatibility, the framework should
 * allow a mixture of declarative and imperative app wiring, however, apps
 * that strive for the maximum ease of maintainability should be able to describe
 * their state machine with a config object alone.
 */
export interface Config {
  /** modules are the module configurations for the app. */
  modules: ModuleConfig[];
  /**
   * golang_bindings specifies explicit interface to implementation type bindings which
   * depinject uses to resolve interface inputs to provider functions.  The scope of this
   * field's configuration is global (not module specific).
   */
  golangBindings: GolangBinding[];
}
export interface ConfigProtoMsg {
  typeUrl: "/cosmos.app.v1alpha1.Config";
  value: Uint8Array;
}
/**
 * Config represents the configuration for a Cosmos SDK ABCI app.
 * It is intended that all state machine logic including the version of
 * baseapp and tx handlers (and possibly even Tendermint) that an app needs
 * can be described in a config object. For compatibility, the framework should
 * allow a mixture of declarative and imperative app wiring, however, apps
 * that strive for the maximum ease of maintainability should be able to describe
 * their state machine with a config object alone.
 */
export interface ConfigAmino {
  /** modules are the module configurations for the app. */
  modules?: ModuleConfigAmino[];
  /**
   * golang_bindings specifies explicit interface to implementation type bindings which
   * depinject uses to resolve interface inputs to provider functions.  The scope of this
   * field's configuration is global (not module specific).
   */
  golang_bindings?: GolangBindingAmino[];
}
export interface ConfigAminoMsg {
  type: "cosmos-sdk/Config";
  value: ConfigAmino;
}
/**
 * Config represents the configuration for a Cosmos SDK ABCI app.
 * It is intended that all state machine logic including the version of
 * baseapp and tx handlers (and possibly even Tendermint) that an app needs
 * can be described in a config object. For compatibility, the framework should
 * allow a mixture of declarative and imperative app wiring, however, apps
 * that strive for the maximum ease of maintainability should be able to describe
 * their state machine with a config object alone.
 */
export interface ConfigSDKType {
  modules: ModuleConfigSDKType[];
  golang_bindings: GolangBindingSDKType[];
}
/** ModuleConfig is a module configuration for an app. */
export interface ModuleConfig {
  /**
   * name is the unique name of the module within the app. It should be a name
   * that persists between different versions of a module so that modules
   * can be smoothly upgraded to new versions.
   * 
   * For example, for the module cosmos.bank.module.v1.Module, we may chose
   * to simply name the module "bank" in the app. When we upgrade to
   * cosmos.bank.module.v2.Module, the app-specific name "bank" stays the same
   * and the framework knows that the v2 module should receive all the same state
   * that the v1 module had. Note: modules should provide info on which versions
   * they can migrate from in the ModuleDescriptor.can_migration_from field.
   */
  name: string;
  /**
   * config is the config object for the module. Module config messages should
   * define a ModuleDescriptor using the cosmos.app.v1alpha1.is_module extension.
   */
  config?: Any;
  /**
   * golang_bindings specifies explicit interface to implementation type bindings which
   * depinject uses to resolve interface inputs to provider functions.  The scope of this
   * field's configuration is module specific.
   */
  golangBindings: GolangBinding[];
}
export interface ModuleConfigProtoMsg {
  typeUrl: "/cosmos.app.v1alpha1.ModuleConfig";
  value: Uint8Array;
}
/** ModuleConfig is a module configuration for an app. */
export interface ModuleConfigAmino {
  /**
   * name is the unique name of the module within the app. It should be a name
   * that persists between different versions of a module so that modules
   * can be smoothly upgraded to new versions.
   * 
   * For example, for the module cosmos.bank.module.v1.Module, we may chose
   * to simply name the module "bank" in the app. When we upgrade to
   * cosmos.bank.module.v2.Module, the app-specific name "bank" stays the same
   * and the framework knows that the v2 module should receive all the same state
   * that the v1 module had. Note: modules should provide info on which versions
   * they can migrate from in the ModuleDescriptor.can_migration_from field.
   */
  name?: string;
  /**
   * config is the config object for the module. Module config messages should
   * define a ModuleDescriptor using the cosmos.app.v1alpha1.is_module extension.
   */
  config?: AnyAmino;
  /**
   * golang_bindings specifies explicit interface to implementation type bindings which
   * depinject uses to resolve interface inputs to provider functions.  The scope of this
   * field's configuration is module specific.
   */
  golang_bindings?: GolangBindingAmino[];
}
export interface ModuleConfigAminoMsg {
  type: "cosmos-sdk/ModuleConfig";
  value: ModuleConfigAmino;
}
/** ModuleConfig is a module configuration for an app. */
export interface ModuleConfigSDKType {
  name: string;
  config?: AnySDKType;
  golang_bindings: GolangBindingSDKType[];
}
/** GolangBinding is an explicit interface type to implementing type binding for dependency injection. */
export interface GolangBinding {
  /** interface_type is the interface type which will be bound to a specific implementation type */
  interfaceType: string;
  /** implementation is the implementing type which will be supplied when an input of type interface is requested */
  implementation: string;
}
export interface GolangBindingProtoMsg {
  typeUrl: "/cosmos.app.v1alpha1.GolangBinding";
  value: Uint8Array;
}
/** GolangBinding is an explicit interface type to implementing type binding for dependency injection. */
export interface GolangBindingAmino {
  /** interface_type is the interface type which will be bound to a specific implementation type */
  interface_type?: string;
  /** implementation is the implementing type which will be supplied when an input of type interface is requested */
  implementation?: string;
}
export interface GolangBindingAminoMsg {
  type: "cosmos-sdk/GolangBinding";
  value: GolangBindingAmino;
}
/** GolangBinding is an explicit interface type to implementing type binding for dependency injection. */
export interface GolangBindingSDKType {
  interface_type: string;
  implementation: string;
}
function createBaseConfig(): Config {
  return {
    modules: [],
    golangBindings: []
  };
}
export const Config = {
  typeUrl: "/cosmos.app.v1alpha1.Config",
  encode(message: Config, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.modules) {
      ModuleConfig.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.golangBindings) {
      GolangBinding.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Config {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.modules.push(ModuleConfig.decode(reader, reader.uint32()));
          break;
        case 2:
          message.golangBindings.push(GolangBinding.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Config {
    return {
      modules: Array.isArray(object?.modules) ? object.modules.map((e: any) => ModuleConfig.fromJSON(e)) : [],
      golangBindings: Array.isArray(object?.golangBindings) ? object.golangBindings.map((e: any) => GolangBinding.fromJSON(e)) : []
    };
  },
  toJSON(message: Config): JsonSafe<Config> {
    const obj: any = {};
    if (message.modules) {
      obj.modules = message.modules.map(e => e ? ModuleConfig.toJSON(e) : undefined);
    } else {
      obj.modules = [];
    }
    if (message.golangBindings) {
      obj.golangBindings = message.golangBindings.map(e => e ? GolangBinding.toJSON(e) : undefined);
    } else {
      obj.golangBindings = [];
    }
    return obj;
  },
  fromPartial(object: Partial<Config>): Config {
    const message = createBaseConfig();
    message.modules = object.modules?.map(e => ModuleConfig.fromPartial(e)) || [];
    message.golangBindings = object.golangBindings?.map(e => GolangBinding.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ConfigAmino): Config {
    const message = createBaseConfig();
    message.modules = object.modules?.map(e => ModuleConfig.fromAmino(e)) || [];
    message.golangBindings = object.golang_bindings?.map(e => GolangBinding.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Config): ConfigAmino {
    const obj: any = {};
    if (message.modules) {
      obj.modules = message.modules.map(e => e ? ModuleConfig.toAmino(e) : undefined);
    } else {
      obj.modules = message.modules;
    }
    if (message.golangBindings) {
      obj.golang_bindings = message.golangBindings.map(e => e ? GolangBinding.toAmino(e) : undefined);
    } else {
      obj.golang_bindings = message.golangBindings;
    }
    return obj;
  },
  fromAminoMsg(object: ConfigAminoMsg): Config {
    return Config.fromAmino(object.value);
  },
  toAminoMsg(message: Config): ConfigAminoMsg {
    return {
      type: "cosmos-sdk/Config",
      value: Config.toAmino(message)
    };
  },
  fromProtoMsg(message: ConfigProtoMsg): Config {
    return Config.decode(message.value);
  },
  toProto(message: Config): Uint8Array {
    return Config.encode(message).finish();
  },
  toProtoMsg(message: Config): ConfigProtoMsg {
    return {
      typeUrl: "/cosmos.app.v1alpha1.Config",
      value: Config.encode(message).finish()
    };
  }
};
function createBaseModuleConfig(): ModuleConfig {
  return {
    name: "",
    config: undefined,
    golangBindings: []
  };
}
export const ModuleConfig = {
  typeUrl: "/cosmos.app.v1alpha1.ModuleConfig",
  encode(message: ModuleConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.config !== undefined) {
      Any.encode(message.config, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.golangBindings) {
      GolangBinding.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): ModuleConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModuleConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.config = Any.decode(reader, reader.uint32());
          break;
        case 3:
          message.golangBindings.push(GolangBinding.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ModuleConfig {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      config: isSet(object.config) ? Any.fromJSON(object.config) : undefined,
      golangBindings: Array.isArray(object?.golangBindings) ? object.golangBindings.map((e: any) => GolangBinding.fromJSON(e)) : []
    };
  },
  toJSON(message: ModuleConfig): JsonSafe<ModuleConfig> {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.config !== undefined && (obj.config = message.config ? Any.toJSON(message.config) : undefined);
    if (message.golangBindings) {
      obj.golangBindings = message.golangBindings.map(e => e ? GolangBinding.toJSON(e) : undefined);
    } else {
      obj.golangBindings = [];
    }
    return obj;
  },
  fromPartial(object: Partial<ModuleConfig>): ModuleConfig {
    const message = createBaseModuleConfig();
    message.name = object.name ?? "";
    message.config = object.config !== undefined && object.config !== null ? Any.fromPartial(object.config) : undefined;
    message.golangBindings = object.golangBindings?.map(e => GolangBinding.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ModuleConfigAmino): ModuleConfig {
    const message = createBaseModuleConfig();
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = Any.fromAmino(object.config);
    }
    message.golangBindings = object.golang_bindings?.map(e => GolangBinding.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: ModuleConfig): ModuleConfigAmino {
    const obj: any = {};
    obj.name = message.name === "" ? undefined : message.name;
    obj.config = message.config ? Any.toAmino(message.config) : undefined;
    if (message.golangBindings) {
      obj.golang_bindings = message.golangBindings.map(e => e ? GolangBinding.toAmino(e) : undefined);
    } else {
      obj.golang_bindings = message.golangBindings;
    }
    return obj;
  },
  fromAminoMsg(object: ModuleConfigAminoMsg): ModuleConfig {
    return ModuleConfig.fromAmino(object.value);
  },
  toAminoMsg(message: ModuleConfig): ModuleConfigAminoMsg {
    return {
      type: "cosmos-sdk/ModuleConfig",
      value: ModuleConfig.toAmino(message)
    };
  },
  fromProtoMsg(message: ModuleConfigProtoMsg): ModuleConfig {
    return ModuleConfig.decode(message.value);
  },
  toProto(message: ModuleConfig): Uint8Array {
    return ModuleConfig.encode(message).finish();
  },
  toProtoMsg(message: ModuleConfig): ModuleConfigProtoMsg {
    return {
      typeUrl: "/cosmos.app.v1alpha1.ModuleConfig",
      value: ModuleConfig.encode(message).finish()
    };
  }
};
function createBaseGolangBinding(): GolangBinding {
  return {
    interfaceType: "",
    implementation: ""
  };
}
export const GolangBinding = {
  typeUrl: "/cosmos.app.v1alpha1.GolangBinding",
  encode(message: GolangBinding, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.interfaceType !== "") {
      writer.uint32(10).string(message.interfaceType);
    }
    if (message.implementation !== "") {
      writer.uint32(18).string(message.implementation);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GolangBinding {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGolangBinding();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.interfaceType = reader.string();
          break;
        case 2:
          message.implementation = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GolangBinding {
    return {
      interfaceType: isSet(object.interfaceType) ? String(object.interfaceType) : "",
      implementation: isSet(object.implementation) ? String(object.implementation) : ""
    };
  },
  toJSON(message: GolangBinding): JsonSafe<GolangBinding> {
    const obj: any = {};
    message.interfaceType !== undefined && (obj.interfaceType = message.interfaceType);
    message.implementation !== undefined && (obj.implementation = message.implementation);
    return obj;
  },
  fromPartial(object: Partial<GolangBinding>): GolangBinding {
    const message = createBaseGolangBinding();
    message.interfaceType = object.interfaceType ?? "";
    message.implementation = object.implementation ?? "";
    return message;
  },
  fromAmino(object: GolangBindingAmino): GolangBinding {
    const message = createBaseGolangBinding();
    if (object.interface_type !== undefined && object.interface_type !== null) {
      message.interfaceType = object.interface_type;
    }
    if (object.implementation !== undefined && object.implementation !== null) {
      message.implementation = object.implementation;
    }
    return message;
  },
  toAmino(message: GolangBinding): GolangBindingAmino {
    const obj: any = {};
    obj.interface_type = message.interfaceType === "" ? undefined : message.interfaceType;
    obj.implementation = message.implementation === "" ? undefined : message.implementation;
    return obj;
  },
  fromAminoMsg(object: GolangBindingAminoMsg): GolangBinding {
    return GolangBinding.fromAmino(object.value);
  },
  toAminoMsg(message: GolangBinding): GolangBindingAminoMsg {
    return {
      type: "cosmos-sdk/GolangBinding",
      value: GolangBinding.toAmino(message)
    };
  },
  fromProtoMsg(message: GolangBindingProtoMsg): GolangBinding {
    return GolangBinding.decode(message.value);
  },
  toProto(message: GolangBinding): Uint8Array {
    return GolangBinding.encode(message).finish();
  },
  toProtoMsg(message: GolangBinding): GolangBindingProtoMsg {
    return {
      typeUrl: "/cosmos.app.v1alpha1.GolangBinding",
      value: GolangBinding.encode(message).finish()
    };
  }
};