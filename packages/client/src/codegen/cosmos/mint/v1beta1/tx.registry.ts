//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.mint.v1beta1.MsgUpdateParams", MsgUpdateParams]];
export const MessageComposer = {
  encoded: {
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cosmos.mint.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cosmos.mint.v1beta1.MsgUpdateParams",
        value
      };
    }
  },
  toJSON: {
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cosmos.mint.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.toJSON(value)
      };
    }
  },
  fromJSON: {
    updateParams(value: any) {
      return {
        typeUrl: "/cosmos.mint.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromJSON(value)
      };
    }
  },
  fromPartial: {
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cosmos.mint.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    }
  }
};