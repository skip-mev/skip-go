//@ts-nocheck
import { MsgStoreCode, MsgInstantiateContract, MsgExecuteContract, MsgMigrateContract, MsgUpdateAdmin, MsgClearAdmin, MsgUpdateParams, MsgUpgradeProposalPassed } from "./msg";
export const AminoConverter = {
  "/secret.compute.v1beta1.MsgStoreCode": {
    aminoType: "wasm/MsgStoreCode",
    toAmino: MsgStoreCode.toAmino,
    fromAmino: MsgStoreCode.fromAmino
  },
  "/secret.compute.v1beta1.MsgInstantiateContract": {
    aminoType: "wasm/MsgInstantiateContract",
    toAmino: MsgInstantiateContract.toAmino,
    fromAmino: MsgInstantiateContract.fromAmino
  },
  "/secret.compute.v1beta1.MsgExecuteContract": {
    aminoType: "wasm/MsgExecuteContract",
    toAmino: MsgExecuteContract.toAmino,
    fromAmino: MsgExecuteContract.fromAmino
  },
  "/secret.compute.v1beta1.MsgMigrateContract": {
    aminoType: "wasm/MsgMigrateContract",
    toAmino: MsgMigrateContract.toAmino,
    fromAmino: MsgMigrateContract.fromAmino
  },
  "/secret.compute.v1beta1.MsgUpdateAdmin": {
    aminoType: "wasm/MsgUpdateAdmin",
    toAmino: MsgUpdateAdmin.toAmino,
    fromAmino: MsgUpdateAdmin.fromAmino
  },
  "/secret.compute.v1beta1.MsgClearAdmin": {
    aminoType: "wasm/MsgClearAdmin",
    toAmino: MsgClearAdmin.toAmino,
    fromAmino: MsgClearAdmin.fromAmino
  },
  "/secret.compute.v1beta1.MsgUpdateParams": {
    aminoType: "wasm/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  },
  "/secret.compute.v1beta1.MsgUpgradeProposalPassed": {
    aminoType: "wasm/MsgUpgradeProposalPassed",
    toAmino: MsgUpgradeProposalPassed.toAmino,
    fromAmino: MsgUpgradeProposalPassed.fromAmino
  }
};