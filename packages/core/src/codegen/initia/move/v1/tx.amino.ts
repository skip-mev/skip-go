//@ts-nocheck
import { MsgExecute } from "./tx";
export const AminoConverter = {
  "/initia.move.v1.MsgExecute": {
    aminoType: "/initia.move.v1.MsgExecute",
    toAmino: MsgExecute.toAmino,
    fromAmino: MsgExecute.fromAmino
  }
};