//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgExecute } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/initia.move.v1.MsgExecute", MsgExecute]];
export const MessageComposer = {
  encoded: {
    execute(value: MsgExecute) {
      return {
        typeUrl: "/initia.move.v1.MsgExecute",
        value: MsgExecute.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    execute(value: MsgExecute) {
      return {
        typeUrl: "/initia.move.v1.MsgExecute",
        value
      };
    }
  },
  toJSON: {
    execute(value: MsgExecute) {
      return {
        typeUrl: "/initia.move.v1.MsgExecute",
        value: MsgExecute.toJSON(value)
      };
    }
  },
  fromJSON: {
    execute(value: any) {
      return {
        typeUrl: "/initia.move.v1.MsgExecute",
        value: MsgExecute.fromJSON(value)
      };
    }
  },
  fromPartial: {
    execute(value: MsgExecute) {
      return {
        typeUrl: "/initia.move.v1.MsgExecute",
        value: MsgExecute.fromPartial(value)
      };
    }
  }
};