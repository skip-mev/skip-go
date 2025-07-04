//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateContract, MsgActivateContract, MsgDeactivateContract, MsgExecuteContractCompat, MsgUpdateParams, MsgRegisterContract } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/injective.wasmx.v1.MsgUpdateContract", MsgUpdateContract], ["/injective.wasmx.v1.MsgActivateContract", MsgActivateContract], ["/injective.wasmx.v1.MsgDeactivateContract", MsgDeactivateContract], ["/injective.wasmx.v1.MsgExecuteContractCompat", MsgExecuteContractCompat], ["/injective.wasmx.v1.MsgUpdateParams", MsgUpdateParams], ["/injective.wasmx.v1.MsgRegisterContract", MsgRegisterContract]];
export const MessageComposer = {
  encoded: {
    updateRegistryContractParams(value: MsgUpdateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateContract",
        value: MsgUpdateContract.encode(value).finish()
      };
    },
    activateRegistryContract(value: MsgActivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgActivateContract",
        value: MsgActivateContract.encode(value).finish()
      };
    },
    deactivateRegistryContract(value: MsgDeactivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgDeactivateContract",
        value: MsgDeactivateContract.encode(value).finish()
      };
    },
    executeContractCompat(value: MsgExecuteContractCompat) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgExecuteContractCompat",
        value: MsgExecuteContractCompat.encode(value).finish()
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    },
    registerContract(value: MsgRegisterContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgRegisterContract",
        value: MsgRegisterContract.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    updateRegistryContractParams(value: MsgUpdateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateContract",
        value
      };
    },
    activateRegistryContract(value: MsgActivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgActivateContract",
        value
      };
    },
    deactivateRegistryContract(value: MsgDeactivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgDeactivateContract",
        value
      };
    },
    executeContractCompat(value: MsgExecuteContractCompat) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgExecuteContractCompat",
        value
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateParams",
        value
      };
    },
    registerContract(value: MsgRegisterContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgRegisterContract",
        value
      };
    }
  },
  toJSON: {
    updateRegistryContractParams(value: MsgUpdateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateContract",
        value: MsgUpdateContract.toJSON(value)
      };
    },
    activateRegistryContract(value: MsgActivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgActivateContract",
        value: MsgActivateContract.toJSON(value)
      };
    },
    deactivateRegistryContract(value: MsgDeactivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgDeactivateContract",
        value: MsgDeactivateContract.toJSON(value)
      };
    },
    executeContractCompat(value: MsgExecuteContractCompat) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgExecuteContractCompat",
        value: MsgExecuteContractCompat.toJSON(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateParams",
        value: MsgUpdateParams.toJSON(value)
      };
    },
    registerContract(value: MsgRegisterContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgRegisterContract",
        value: MsgRegisterContract.toJSON(value)
      };
    }
  },
  fromJSON: {
    updateRegistryContractParams(value: any) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateContract",
        value: MsgUpdateContract.fromJSON(value)
      };
    },
    activateRegistryContract(value: any) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgActivateContract",
        value: MsgActivateContract.fromJSON(value)
      };
    },
    deactivateRegistryContract(value: any) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgDeactivateContract",
        value: MsgDeactivateContract.fromJSON(value)
      };
    },
    executeContractCompat(value: any) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgExecuteContractCompat",
        value: MsgExecuteContractCompat.fromJSON(value)
      };
    },
    updateParams(value: any) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateParams",
        value: MsgUpdateParams.fromJSON(value)
      };
    },
    registerContract(value: any) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgRegisterContract",
        value: MsgRegisterContract.fromJSON(value)
      };
    }
  },
  fromPartial: {
    updateRegistryContractParams(value: MsgUpdateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateContract",
        value: MsgUpdateContract.fromPartial(value)
      };
    },
    activateRegistryContract(value: MsgActivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgActivateContract",
        value: MsgActivateContract.fromPartial(value)
      };
    },
    deactivateRegistryContract(value: MsgDeactivateContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgDeactivateContract",
        value: MsgDeactivateContract.fromPartial(value)
      };
    },
    executeContractCompat(value: MsgExecuteContractCompat) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgExecuteContractCompat",
        value: MsgExecuteContractCompat.fromPartial(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    },
    registerContract(value: MsgRegisterContract) {
      return {
        typeUrl: "/injective.wasmx.v1.MsgRegisterContract",
        value: MsgRegisterContract.fromPartial(value)
      };
    }
  }
};