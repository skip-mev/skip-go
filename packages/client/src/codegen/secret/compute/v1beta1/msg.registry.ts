//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgStoreCode, MsgInstantiateContract, MsgExecuteContract, MsgMigrateContract, MsgUpdateAdmin, MsgClearAdmin, MsgUpdateParams, MsgUpgradeProposalPassed } from "./msg";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/secret.compute.v1beta1.MsgStoreCode", MsgStoreCode], ["/secret.compute.v1beta1.MsgInstantiateContract", MsgInstantiateContract], ["/secret.compute.v1beta1.MsgExecuteContract", MsgExecuteContract], ["/secret.compute.v1beta1.MsgMigrateContract", MsgMigrateContract], ["/secret.compute.v1beta1.MsgUpdateAdmin", MsgUpdateAdmin], ["/secret.compute.v1beta1.MsgClearAdmin", MsgClearAdmin], ["/secret.compute.v1beta1.MsgUpdateParams", MsgUpdateParams], ["/secret.compute.v1beta1.MsgUpgradeProposalPassed", MsgUpgradeProposalPassed]];
export const MessageComposer = {
  encoded: {
    storeCode(value: MsgStoreCode) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgStoreCode",
        value: MsgStoreCode.encode(value).finish()
      };
    },
    instantiateContract(value: MsgInstantiateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgInstantiateContract",
        value: MsgInstantiateContract.encode(value).finish()
      };
    },
    executeContract(value: MsgExecuteContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
        value: MsgExecuteContract.encode(value).finish()
      };
    },
    migrateContract(value: MsgMigrateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgMigrateContract",
        value: MsgMigrateContract.encode(value).finish()
      };
    },
    updateAdmin(value: MsgUpdateAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateAdmin",
        value: MsgUpdateAdmin.encode(value).finish()
      };
    },
    clearAdmin(value: MsgClearAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgClearAdmin",
        value: MsgClearAdmin.encode(value).finish()
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    },
    upgradeProposalPassed(value: MsgUpgradeProposalPassed) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpgradeProposalPassed",
        value: MsgUpgradeProposalPassed.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    storeCode(value: MsgStoreCode) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgStoreCode",
        value
      };
    },
    instantiateContract(value: MsgInstantiateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgInstantiateContract",
        value
      };
    },
    executeContract(value: MsgExecuteContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
        value
      };
    },
    migrateContract(value: MsgMigrateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgMigrateContract",
        value
      };
    },
    updateAdmin(value: MsgUpdateAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateAdmin",
        value
      };
    },
    clearAdmin(value: MsgClearAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgClearAdmin",
        value
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateParams",
        value
      };
    },
    upgradeProposalPassed(value: MsgUpgradeProposalPassed) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpgradeProposalPassed",
        value
      };
    }
  },
  toJSON: {
    storeCode(value: MsgStoreCode) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgStoreCode",
        value: MsgStoreCode.toJSON(value)
      };
    },
    instantiateContract(value: MsgInstantiateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgInstantiateContract",
        value: MsgInstantiateContract.toJSON(value)
      };
    },
    executeContract(value: MsgExecuteContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
        value: MsgExecuteContract.toJSON(value)
      };
    },
    migrateContract(value: MsgMigrateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgMigrateContract",
        value: MsgMigrateContract.toJSON(value)
      };
    },
    updateAdmin(value: MsgUpdateAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateAdmin",
        value: MsgUpdateAdmin.toJSON(value)
      };
    },
    clearAdmin(value: MsgClearAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgClearAdmin",
        value: MsgClearAdmin.toJSON(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.toJSON(value)
      };
    },
    upgradeProposalPassed(value: MsgUpgradeProposalPassed) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpgradeProposalPassed",
        value: MsgUpgradeProposalPassed.toJSON(value)
      };
    }
  },
  fromJSON: {
    storeCode(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgStoreCode",
        value: MsgStoreCode.fromJSON(value)
      };
    },
    instantiateContract(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgInstantiateContract",
        value: MsgInstantiateContract.fromJSON(value)
      };
    },
    executeContract(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
        value: MsgExecuteContract.fromJSON(value)
      };
    },
    migrateContract(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgMigrateContract",
        value: MsgMigrateContract.fromJSON(value)
      };
    },
    updateAdmin(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateAdmin",
        value: MsgUpdateAdmin.fromJSON(value)
      };
    },
    clearAdmin(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgClearAdmin",
        value: MsgClearAdmin.fromJSON(value)
      };
    },
    updateParams(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromJSON(value)
      };
    },
    upgradeProposalPassed(value: any) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpgradeProposalPassed",
        value: MsgUpgradeProposalPassed.fromJSON(value)
      };
    }
  },
  fromPartial: {
    storeCode(value: MsgStoreCode) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgStoreCode",
        value: MsgStoreCode.fromPartial(value)
      };
    },
    instantiateContract(value: MsgInstantiateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgInstantiateContract",
        value: MsgInstantiateContract.fromPartial(value)
      };
    },
    executeContract(value: MsgExecuteContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial(value)
      };
    },
    migrateContract(value: MsgMigrateContract) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgMigrateContract",
        value: MsgMigrateContract.fromPartial(value)
      };
    },
    updateAdmin(value: MsgUpdateAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateAdmin",
        value: MsgUpdateAdmin.fromPartial(value)
      };
    },
    clearAdmin(value: MsgClearAdmin) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgClearAdmin",
        value: MsgClearAdmin.fromPartial(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    },
    upgradeProposalPassed(value: MsgUpgradeProposalPassed) {
      return {
        typeUrl: "/secret.compute.v1beta1.MsgUpgradeProposalPassed",
        value: MsgUpgradeProposalPassed.fromPartial(value)
      };
    }
  }
};