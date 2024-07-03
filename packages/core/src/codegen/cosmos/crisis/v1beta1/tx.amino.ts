//@ts-nocheck
import { MsgVerifyInvariant, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/cosmos.crisis.v1beta1.MsgVerifyInvariant": {
    aminoType: "cosmos-sdk/MsgVerifyInvariant",
    toAmino: MsgVerifyInvariant.toAmino,
    fromAmino: MsgVerifyInvariant.fromAmino
  },
  "/cosmos.crisis.v1beta1.MsgUpdateParams": {
    aminoType: "cosmos-sdk/x/crisis/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};