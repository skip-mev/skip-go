//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../../helpers";
import { JsonSafe } from "../../../../json-safe";
/** Config is the config object of the x/auth/tx package. */
export interface Config {
  /**
   * skip_ante_handler defines whether the ante handler registration should be skipped in case an app wants to override
   * this functionality.
   */
  skipAnteHandler: boolean;
  /**
   * skip_post_handler defines whether the post handler registration should be skipped in case an app wants to override
   * this functionality.
   */
  skipPostHandler: boolean;
}
export interface ConfigProtoMsg {
  typeUrl: "/cosmos.tx.config.v1.Config";
  value: Uint8Array;
}
/** Config is the config object of the x/auth/tx package. */
export interface ConfigAmino {
  /**
   * skip_ante_handler defines whether the ante handler registration should be skipped in case an app wants to override
   * this functionality.
   */
  skip_ante_handler?: boolean;
  /**
   * skip_post_handler defines whether the post handler registration should be skipped in case an app wants to override
   * this functionality.
   */
  skip_post_handler?: boolean;
}
export interface ConfigAminoMsg {
  type: "cosmos-sdk/Config";
  value: ConfigAmino;
}
/** Config is the config object of the x/auth/tx package. */
export interface ConfigSDKType {
  skip_ante_handler: boolean;
  skip_post_handler: boolean;
}
function createBaseConfig(): Config {
  return {
    skipAnteHandler: false,
    skipPostHandler: false
  };
}
export const Config = {
  typeUrl: "/cosmos.tx.config.v1.Config",
  encode(message: Config, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.skipAnteHandler === true) {
      writer.uint32(8).bool(message.skipAnteHandler);
    }
    if (message.skipPostHandler === true) {
      writer.uint32(16).bool(message.skipPostHandler);
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
          message.skipAnteHandler = reader.bool();
          break;
        case 2:
          message.skipPostHandler = reader.bool();
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
      skipAnteHandler: isSet(object.skipAnteHandler) ? Boolean(object.skipAnteHandler) : false,
      skipPostHandler: isSet(object.skipPostHandler) ? Boolean(object.skipPostHandler) : false
    };
  },
  toJSON(message: Config): JsonSafe<Config> {
    const obj: any = {};
    message.skipAnteHandler !== undefined && (obj.skipAnteHandler = message.skipAnteHandler);
    message.skipPostHandler !== undefined && (obj.skipPostHandler = message.skipPostHandler);
    return obj;
  },
  fromPartial(object: Partial<Config>): Config {
    const message = createBaseConfig();
    message.skipAnteHandler = object.skipAnteHandler ?? false;
    message.skipPostHandler = object.skipPostHandler ?? false;
    return message;
  },
  fromAmino(object: ConfigAmino): Config {
    const message = createBaseConfig();
    if (object.skip_ante_handler !== undefined && object.skip_ante_handler !== null) {
      message.skipAnteHandler = object.skip_ante_handler;
    }
    if (object.skip_post_handler !== undefined && object.skip_post_handler !== null) {
      message.skipPostHandler = object.skip_post_handler;
    }
    return message;
  },
  toAmino(message: Config): ConfigAmino {
    const obj: any = {};
    obj.skip_ante_handler = message.skipAnteHandler === false ? undefined : message.skipAnteHandler;
    obj.skip_post_handler = message.skipPostHandler === false ? undefined : message.skipPostHandler;
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
      typeUrl: "/cosmos.tx.config.v1.Config",
      value: Config.encode(message).finish()
    };
  }
};