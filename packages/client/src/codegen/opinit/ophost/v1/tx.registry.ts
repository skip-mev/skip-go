//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgInitiateTokenDeposit } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/opinit.ophost.v1.MsgInitiateTokenDeposit", MsgInitiateTokenDeposit]];
export const MessageComposer = {
  encoded: {
    initiateTokenDeposit(value: MsgInitiateTokenDeposit) {
      return {
        typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit",
        value: MsgInitiateTokenDeposit.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    initiateTokenDeposit(value: MsgInitiateTokenDeposit) {
      return {
        typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit",
        value
      };
    }
  },
  toJSON: {
    initiateTokenDeposit(value: MsgInitiateTokenDeposit) {
      return {
        typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit",
        value: MsgInitiateTokenDeposit.toJSON(value)
      };
    }
  },
  fromJSON: {
    initiateTokenDeposit(value: any) {
      return {
        typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit",
        value: MsgInitiateTokenDeposit.fromJSON(value)
      };
    }
  },
  fromPartial: {
    initiateTokenDeposit(value: MsgInitiateTokenDeposit) {
      return {
        typeUrl: "/opinit.ophost.v1.MsgInitiateTokenDeposit",
        value: MsgInitiateTokenDeposit.fromPartial(value)
      };
    }
  }
};