//@ts-nocheck
import { MsgRegisterRevenue, MsgUpdateRevenue, MsgCancelRevenue, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/evmos.revenue.v1.MsgRegisterRevenue": {
    aminoType: "evmos/MsgRegisterRevenue",
    toAmino: MsgRegisterRevenue.toAmino,
    fromAmino: MsgRegisterRevenue.fromAmino
  },
  "/evmos.revenue.v1.MsgUpdateRevenue": {
    aminoType: "evmos/MsgUpdateRevenue",
    toAmino: MsgUpdateRevenue.toAmino,
    fromAmino: MsgUpdateRevenue.fromAmino
  },
  "/evmos.revenue.v1.MsgCancelRevenue": {
    aminoType: "evmos/MsgCancelRevenue",
    toAmino: MsgCancelRevenue.toAmino,
    fromAmino: MsgCancelRevenue.fromAmino
  },
  "/evmos.revenue.v1.MsgUpdateParams": {
    aminoType: "evmos/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};