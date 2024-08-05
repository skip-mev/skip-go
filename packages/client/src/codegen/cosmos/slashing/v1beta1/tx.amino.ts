//@ts-nocheck
import { MsgUnjail, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/cosmos.slashing.v1beta1.MsgUnjail": {
    aminoType: "cosmos-sdk/MsgUnjail",
    toAmino: MsgUnjail.toAmino,
    fromAmino: MsgUnjail.fromAmino
  },
  "/cosmos.slashing.v1beta1.MsgUpdateParams": {
    aminoType: "cosmos-sdk/x/slashing/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};