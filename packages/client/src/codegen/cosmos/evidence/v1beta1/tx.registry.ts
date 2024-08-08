//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSubmitEvidence } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.evidence.v1beta1.MsgSubmitEvidence", MsgSubmitEvidence]];
export const MessageComposer = {
  encoded: {
    submitEvidence(value: MsgSubmitEvidence) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value: MsgSubmitEvidence.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    submitEvidence(value: MsgSubmitEvidence) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value
      };
    }
  },
  toJSON: {
    submitEvidence(value: MsgSubmitEvidence) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value: MsgSubmitEvidence.toJSON(value)
      };
    }
  },
  fromJSON: {
    submitEvidence(value: any) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value: MsgSubmitEvidence.fromJSON(value)
      };
    }
  },
  fromPartial: {
    submitEvidence(value: MsgSubmitEvidence) {
      return {
        typeUrl: "/cosmos.evidence.v1beta1.MsgSubmitEvidence",
        value: MsgSubmitEvidence.fromPartial(value)
      };
    }
  }
};