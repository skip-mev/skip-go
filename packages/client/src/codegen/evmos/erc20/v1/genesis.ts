//@ts-nocheck
import { TokenPair, TokenPairAmino, TokenPairSDKType } from "./erc20";
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/** GenesisState defines the module's genesis state. */
export interface GenesisState {
  /** params are the erc20 module parameters at genesis */
  params: Params;
  /** token_pairs is a slice of the registered token pairs at genesis */
  tokenPairs: TokenPair[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/evmos.erc20.v1.GenesisState";
  value: Uint8Array;
}
/**
 * GenesisState defines the module's genesis state.
 * @name GenesisStateAmino
 * @package evmos.erc20.v1
 * @see proto type: evmos.erc20.v1.GenesisState
 */
export interface GenesisStateAmino {
  /**
   * params are the erc20 module parameters at genesis
   */
  params?: ParamsAmino;
  /**
   * token_pairs is a slice of the registered token pairs at genesis
   */
  token_pairs?: TokenPairAmino[];
}
export interface GenesisStateAminoMsg {
  type: "erc20/GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the module's genesis state. */
export interface GenesisStateSDKType {
  params: ParamsSDKType;
  token_pairs: TokenPairSDKType[];
}
/** Params defines the erc20 module params */
export interface Params {
  /** enable_erc20 is the parameter to enable the conversion of Cosmos coins <--> ERC20 tokens. */
  enableErc20: boolean;
  /**
   * enable_evm_hook is the parameter to enable the EVM hook that converts an ERC20 token to a Cosmos
   * Coin by transferring the Tokens through a MsgEthereumTx to the ModuleAddress Ethereum address.
   */
  enableEvmHook: boolean;
}
export interface ParamsProtoMsg {
  typeUrl: "/evmos.erc20.v1.Params";
  value: Uint8Array;
}
/**
 * Params defines the erc20 module params
 * @name ParamsAmino
 * @package evmos.erc20.v1
 * @see proto type: evmos.erc20.v1.Params
 */
export interface ParamsAmino {
  /**
   * enable_erc20 is the parameter to enable the conversion of Cosmos coins <--> ERC20 tokens.
   */
  enable_erc20?: boolean;
  /**
   * enable_evm_hook is the parameter to enable the EVM hook that converts an ERC20 token to a Cosmos
   * Coin by transferring the Tokens through a MsgEthereumTx to the ModuleAddress Ethereum address.
   */
  enable_evm_hook?: boolean;
}
export interface ParamsAminoMsg {
  type: "erc20/Params";
  value: ParamsAmino;
}
/** Params defines the erc20 module params */
export interface ParamsSDKType {
  enable_erc20: boolean;
  enable_evm_hook: boolean;
}
function createBaseGenesisState(): GenesisState {
  return {
    params: Params.fromPartial({}),
    tokenPairs: []
  };
}
export const GenesisState = {
  typeUrl: "/evmos.erc20.v1.GenesisState",
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.tokenPairs) {
      TokenPair.encode(v!, writer.uint32(18).fork()).ldelim();
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
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.tokenPairs.push(TokenPair.decode(reader, reader.uint32()));
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
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      tokenPairs: Array.isArray(object?.tokenPairs) ? object.tokenPairs.map((e: any) => TokenPair.fromJSON(e)) : []
    };
  },
  toJSON(message: GenesisState): JsonSafe<GenesisState> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.tokenPairs) {
      obj.tokenPairs = message.tokenPairs.map(e => e ? TokenPair.toJSON(e) : undefined);
    } else {
      obj.tokenPairs = [];
    }
    return obj;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.tokenPairs = object.tokenPairs?.map(e => TokenPair.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    message.tokenPairs = object.token_pairs?.map(e => TokenPair.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    if (message.tokenPairs) {
      obj.token_pairs = message.tokenPairs.map(e => e ? TokenPair.toAmino(e) : undefined);
    } else {
      obj.token_pairs = message.tokenPairs;
    }
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  toAminoMsg(message: GenesisState): GenesisStateAminoMsg {
    return {
      type: "erc20/GenesisState",
      value: GenesisState.toAmino(message)
    };
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/evmos.erc20.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};
function createBaseParams(): Params {
  return {
    enableErc20: false,
    enableEvmHook: false
  };
}
export const Params = {
  typeUrl: "/evmos.erc20.v1.Params",
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.enableErc20 === true) {
      writer.uint32(8).bool(message.enableErc20);
    }
    if (message.enableEvmHook === true) {
      writer.uint32(16).bool(message.enableEvmHook);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.enableErc20 = reader.bool();
          break;
        case 2:
          message.enableEvmHook = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Params {
    return {
      enableErc20: isSet(object.enableErc20) ? Boolean(object.enableErc20) : false,
      enableEvmHook: isSet(object.enableEvmHook) ? Boolean(object.enableEvmHook) : false
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.enableErc20 !== undefined && (obj.enableErc20 = message.enableErc20);
    message.enableEvmHook !== undefined && (obj.enableEvmHook = message.enableEvmHook);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.enableErc20 = object.enableErc20 ?? false;
    message.enableEvmHook = object.enableEvmHook ?? false;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.enable_erc20 !== undefined && object.enable_erc20 !== null) {
      message.enableErc20 = object.enable_erc20;
    }
    if (object.enable_evm_hook !== undefined && object.enable_evm_hook !== null) {
      message.enableEvmHook = object.enable_evm_hook;
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.enable_erc20 = message.enableErc20 === false ? undefined : message.enableErc20;
    obj.enable_evm_hook = message.enableEvmHook === false ? undefined : message.enableEvmHook;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  toAminoMsg(message: Params): ParamsAminoMsg {
    return {
      type: "erc20/Params",
      value: Params.toAmino(message)
    };
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/evmos.erc20.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};