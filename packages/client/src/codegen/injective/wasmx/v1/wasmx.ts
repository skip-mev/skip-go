//@ts-nocheck
import { AccessConfig, AccessConfigAmino, AccessConfigSDKType } from "../../../cosmwasm/wasm/v1/types";
import { FundingMode, fundingModeFromJSON, fundingModeToJSON } from "./proposal";
import { Long, isSet } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
export interface Params {
  /**
   * Set the status to active to indicate that contracts can be executed in
   * begin blocker.
   */
  isExecutionEnabled: boolean;
  /**
   * Maximum aggregate total gas to be used for the contract executions in the
   * BeginBlocker.
   */
  maxBeginBlockTotalGas: Long;
  /**
   * the maximum gas limit each individual contract can consume in the
   * BeginBlocker.
   */
  maxContractGasLimit: Long;
  /**
   * min_gas_price defines the minimum gas price the contracts must pay to be
   * executed in the BeginBlocker.
   */
  minGasPrice: Long;
  registerContractAccess: AccessConfig;
}
export interface ParamsProtoMsg {
  typeUrl: "/injective.wasmx.v1.Params";
  value: Uint8Array;
}
export interface ParamsAmino {
  /**
   * Set the status to active to indicate that contracts can be executed in
   * begin blocker.
   */
  is_execution_enabled?: boolean;
  /**
   * Maximum aggregate total gas to be used for the contract executions in the
   * BeginBlocker.
   */
  max_begin_block_total_gas?: string;
  /**
   * the maximum gas limit each individual contract can consume in the
   * BeginBlocker.
   */
  max_contract_gas_limit?: string;
  /**
   * min_gas_price defines the minimum gas price the contracts must pay to be
   * executed in the BeginBlocker.
   */
  min_gas_price?: string;
  register_contract_access: AccessConfigAmino;
}
export interface ParamsAminoMsg {
  type: "wasmx/Params";
  value: ParamsAmino;
}
export interface ParamsSDKType {
  is_execution_enabled: boolean;
  max_begin_block_total_gas: Long;
  max_contract_gas_limit: Long;
  min_gas_price: Long;
  register_contract_access: AccessConfigSDKType;
}
export interface RegisteredContract {
  /** limit of gas per BB execution */
  gasLimit: Long;
  /** gas price that contract is willing to pay for execution in BeginBlocker */
  gasPrice: Long;
  /** is contract currently active */
  isExecutable: boolean;
  /**
   * code_id that is allowed to be executed (to prevent malicious updates) - if
   * nil/0 any code_id can be executed
   */
  codeId?: Long;
  /** optional - admin addr that is allowed to update contract data */
  adminAddress?: string;
  /**
   * Optional: address of the contract granting fee
   * Must be set if fund_mode is GrantOnly
   */
  granterAddress?: string;
  /** funding mode */
  fundMode: FundingMode;
}
export interface RegisteredContractProtoMsg {
  typeUrl: "/injective.wasmx.v1.RegisteredContract";
  value: Uint8Array;
}
export interface RegisteredContractAmino {
  /** limit of gas per BB execution */
  gas_limit?: string;
  /** gas price that contract is willing to pay for execution in BeginBlocker */
  gas_price?: string;
  /** is contract currently active */
  is_executable?: boolean;
  /**
   * code_id that is allowed to be executed (to prevent malicious updates) - if
   * nil/0 any code_id can be executed
   */
  code_id?: string;
  /** optional - admin addr that is allowed to update contract data */
  admin_address?: string;
  /**
   * Optional: address of the contract granting fee
   * Must be set if fund_mode is GrantOnly
   */
  granter_address?: string;
  /** funding mode */
  fund_mode?: FundingMode;
}
export interface RegisteredContractAminoMsg {
  type: "/injective.wasmx.v1.RegisteredContract";
  value: RegisteredContractAmino;
}
export interface RegisteredContractSDKType {
  gas_limit: Long;
  gas_price: Long;
  is_executable: boolean;
  code_id?: Long;
  admin_address?: string;
  granter_address?: string;
  fund_mode: FundingMode;
}
function createBaseParams(): Params {
  return {
    isExecutionEnabled: false,
    maxBeginBlockTotalGas: Long.UZERO,
    maxContractGasLimit: Long.UZERO,
    minGasPrice: Long.UZERO,
    registerContractAccess: AccessConfig.fromPartial({})
  };
}
export const Params = {
  typeUrl: "/injective.wasmx.v1.Params",
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isExecutionEnabled === true) {
      writer.uint32(8).bool(message.isExecutionEnabled);
    }
    if (!message.maxBeginBlockTotalGas.isZero()) {
      writer.uint32(16).uint64(message.maxBeginBlockTotalGas);
    }
    if (!message.maxContractGasLimit.isZero()) {
      writer.uint32(24).uint64(message.maxContractGasLimit);
    }
    if (!message.minGasPrice.isZero()) {
      writer.uint32(32).uint64(message.minGasPrice);
    }
    if (message.registerContractAccess !== undefined) {
      AccessConfig.encode(message.registerContractAccess, writer.uint32(42).fork()).ldelim();
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
          message.isExecutionEnabled = reader.bool();
          break;
        case 2:
          message.maxBeginBlockTotalGas = (reader.uint64() as Long);
          break;
        case 3:
          message.maxContractGasLimit = (reader.uint64() as Long);
          break;
        case 4:
          message.minGasPrice = (reader.uint64() as Long);
          break;
        case 5:
          message.registerContractAccess = AccessConfig.decode(reader, reader.uint32());
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
      isExecutionEnabled: isSet(object.isExecutionEnabled) ? Boolean(object.isExecutionEnabled) : false,
      maxBeginBlockTotalGas: isSet(object.maxBeginBlockTotalGas) ? Long.fromValue(object.maxBeginBlockTotalGas) : Long.UZERO,
      maxContractGasLimit: isSet(object.maxContractGasLimit) ? Long.fromValue(object.maxContractGasLimit) : Long.UZERO,
      minGasPrice: isSet(object.minGasPrice) ? Long.fromValue(object.minGasPrice) : Long.UZERO,
      registerContractAccess: isSet(object.registerContractAccess) ? AccessConfig.fromJSON(object.registerContractAccess) : undefined
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.isExecutionEnabled !== undefined && (obj.isExecutionEnabled = message.isExecutionEnabled);
    message.maxBeginBlockTotalGas !== undefined && (obj.maxBeginBlockTotalGas = (message.maxBeginBlockTotalGas || Long.UZERO).toString());
    message.maxContractGasLimit !== undefined && (obj.maxContractGasLimit = (message.maxContractGasLimit || Long.UZERO).toString());
    message.minGasPrice !== undefined && (obj.minGasPrice = (message.minGasPrice || Long.UZERO).toString());
    message.registerContractAccess !== undefined && (obj.registerContractAccess = message.registerContractAccess ? AccessConfig.toJSON(message.registerContractAccess) : undefined);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.isExecutionEnabled = object.isExecutionEnabled ?? false;
    message.maxBeginBlockTotalGas = object.maxBeginBlockTotalGas !== undefined && object.maxBeginBlockTotalGas !== null ? Long.fromValue(object.maxBeginBlockTotalGas) : Long.UZERO;
    message.maxContractGasLimit = object.maxContractGasLimit !== undefined && object.maxContractGasLimit !== null ? Long.fromValue(object.maxContractGasLimit) : Long.UZERO;
    message.minGasPrice = object.minGasPrice !== undefined && object.minGasPrice !== null ? Long.fromValue(object.minGasPrice) : Long.UZERO;
    message.registerContractAccess = object.registerContractAccess !== undefined && object.registerContractAccess !== null ? AccessConfig.fromPartial(object.registerContractAccess) : undefined;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.is_execution_enabled !== undefined && object.is_execution_enabled !== null) {
      message.isExecutionEnabled = object.is_execution_enabled;
    }
    if (object.max_begin_block_total_gas !== undefined && object.max_begin_block_total_gas !== null) {
      message.maxBeginBlockTotalGas = Long.fromString(object.max_begin_block_total_gas);
    }
    if (object.max_contract_gas_limit !== undefined && object.max_contract_gas_limit !== null) {
      message.maxContractGasLimit = Long.fromString(object.max_contract_gas_limit);
    }
    if (object.min_gas_price !== undefined && object.min_gas_price !== null) {
      message.minGasPrice = Long.fromString(object.min_gas_price);
    }
    if (object.register_contract_access !== undefined && object.register_contract_access !== null) {
      message.registerContractAccess = AccessConfig.fromAmino(object.register_contract_access);
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.is_execution_enabled = message.isExecutionEnabled === false ? undefined : message.isExecutionEnabled;
    obj.max_begin_block_total_gas = !message.maxBeginBlockTotalGas.isZero() ? message.maxBeginBlockTotalGas.toString() : undefined;
    obj.max_contract_gas_limit = !message.maxContractGasLimit.isZero() ? message.maxContractGasLimit.toString() : undefined;
    obj.min_gas_price = !message.minGasPrice.isZero() ? message.minGasPrice.toString() : undefined;
    obj.register_contract_access = message.registerContractAccess ? AccessConfig.toAmino(message.registerContractAccess) : AccessConfig.toAmino(AccessConfig.fromPartial({}));
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  toAminoMsg(message: Params): ParamsAminoMsg {
    return {
      type: "wasmx/Params",
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
      typeUrl: "/injective.wasmx.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBaseRegisteredContract(): RegisteredContract {
  return {
    gasLimit: Long.UZERO,
    gasPrice: Long.UZERO,
    isExecutable: false,
    codeId: undefined,
    adminAddress: undefined,
    granterAddress: undefined,
    fundMode: 0
  };
}
export const RegisteredContract = {
  typeUrl: "/injective.wasmx.v1.RegisteredContract",
  encode(message: RegisteredContract, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.gasLimit.isZero()) {
      writer.uint32(8).uint64(message.gasLimit);
    }
    if (!message.gasPrice.isZero()) {
      writer.uint32(16).uint64(message.gasPrice);
    }
    if (message.isExecutable === true) {
      writer.uint32(24).bool(message.isExecutable);
    }
    if (message.codeId !== undefined) {
      writer.uint32(32).uint64(message.codeId);
    }
    if (message.adminAddress !== undefined) {
      writer.uint32(42).string(message.adminAddress);
    }
    if (message.granterAddress !== undefined) {
      writer.uint32(50).string(message.granterAddress);
    }
    if (message.fundMode !== 0) {
      writer.uint32(56).int32(message.fundMode);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): RegisteredContract {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisteredContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gasLimit = (reader.uint64() as Long);
          break;
        case 2:
          message.gasPrice = (reader.uint64() as Long);
          break;
        case 3:
          message.isExecutable = reader.bool();
          break;
        case 4:
          message.codeId = (reader.uint64() as Long);
          break;
        case 5:
          message.adminAddress = reader.string();
          break;
        case 6:
          message.granterAddress = reader.string();
          break;
        case 7:
          message.fundMode = (reader.int32() as any);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): RegisteredContract {
    return {
      gasLimit: isSet(object.gasLimit) ? Long.fromValue(object.gasLimit) : Long.UZERO,
      gasPrice: isSet(object.gasPrice) ? Long.fromValue(object.gasPrice) : Long.UZERO,
      isExecutable: isSet(object.isExecutable) ? Boolean(object.isExecutable) : false,
      codeId: isSet(object.codeId) ? Long.fromValue(object.codeId) : undefined,
      adminAddress: isSet(object.adminAddress) ? String(object.adminAddress) : undefined,
      granterAddress: isSet(object.granterAddress) ? String(object.granterAddress) : undefined,
      fundMode: isSet(object.fundMode) ? fundingModeFromJSON(object.fundMode) : -1
    };
  },
  toJSON(message: RegisteredContract): JsonSafe<RegisteredContract> {
    const obj: any = {};
    message.gasLimit !== undefined && (obj.gasLimit = (message.gasLimit || Long.UZERO).toString());
    message.gasPrice !== undefined && (obj.gasPrice = (message.gasPrice || Long.UZERO).toString());
    message.isExecutable !== undefined && (obj.isExecutable = message.isExecutable);
    if (message.codeId !== undefined) {
      obj.codeId = message.codeId.toString();
    }
    message.adminAddress !== undefined && (obj.adminAddress = message.adminAddress);
    message.granterAddress !== undefined && (obj.granterAddress = message.granterAddress);
    message.fundMode !== undefined && (obj.fundMode = fundingModeToJSON(message.fundMode));
    return obj;
  },
  fromPartial(object: Partial<RegisteredContract>): RegisteredContract {
    const message = createBaseRegisteredContract();
    message.gasLimit = object.gasLimit !== undefined && object.gasLimit !== null ? Long.fromValue(object.gasLimit) : Long.UZERO;
    message.gasPrice = object.gasPrice !== undefined && object.gasPrice !== null ? Long.fromValue(object.gasPrice) : Long.UZERO;
    message.isExecutable = object.isExecutable ?? false;
    message.codeId = object.codeId !== undefined && object.codeId !== null ? Long.fromValue(object.codeId) : undefined;
    message.adminAddress = object.adminAddress ?? undefined;
    message.granterAddress = object.granterAddress ?? undefined;
    message.fundMode = object.fundMode ?? 0;
    return message;
  },
  fromAmino(object: RegisteredContractAmino): RegisteredContract {
    const message = createBaseRegisteredContract();
    if (object.gas_limit !== undefined && object.gas_limit !== null) {
      message.gasLimit = Long.fromString(object.gas_limit);
    }
    if (object.gas_price !== undefined && object.gas_price !== null) {
      message.gasPrice = Long.fromString(object.gas_price);
    }
    if (object.is_executable !== undefined && object.is_executable !== null) {
      message.isExecutable = object.is_executable;
    }
    if (object.code_id !== undefined && object.code_id !== null) {
      message.codeId = Long.fromString(object.code_id);
    }
    if (object.admin_address !== undefined && object.admin_address !== null) {
      message.adminAddress = object.admin_address;
    }
    if (object.granter_address !== undefined && object.granter_address !== null) {
      message.granterAddress = object.granter_address;
    }
    if (object.fund_mode !== undefined && object.fund_mode !== null) {
      message.fundMode = object.fund_mode;
    }
    return message;
  },
  toAmino(message: RegisteredContract): RegisteredContractAmino {
    const obj: any = {};
    obj.gas_limit = !message.gasLimit.isZero() ? message.gasLimit.toString() : undefined;
    obj.gas_price = !message.gasPrice.isZero() ? message.gasPrice.toString() : undefined;
    obj.is_executable = message.isExecutable === false ? undefined : message.isExecutable;
    obj.code_id = !message.codeId.isZero() ? message.codeId.toString() : undefined;
    obj.admin_address = message.adminAddress === null ? undefined : message.adminAddress;
    obj.granter_address = message.granterAddress === null ? undefined : message.granterAddress;
    obj.fund_mode = message.fundMode === 0 ? undefined : message.fundMode;
    return obj;
  },
  fromAminoMsg(object: RegisteredContractAminoMsg): RegisteredContract {
    return RegisteredContract.fromAmino(object.value);
  },
  fromProtoMsg(message: RegisteredContractProtoMsg): RegisteredContract {
    return RegisteredContract.decode(message.value);
  },
  toProto(message: RegisteredContract): Uint8Array {
    return RegisteredContract.encode(message).finish();
  },
  toProtoMsg(message: RegisteredContract): RegisteredContractProtoMsg {
    return {
      typeUrl: "/injective.wasmx.v1.RegisteredContract",
      value: RegisteredContract.encode(message).finish()
    };
  }
};