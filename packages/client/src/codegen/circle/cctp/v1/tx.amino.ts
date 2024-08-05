//@ts-nocheck
import { MsgAcceptOwner, MsgAddRemoteTokenMessenger, MsgDepositForBurn, MsgDepositForBurnWithCaller, MsgDisableAttester, MsgEnableAttester, MsgLinkTokenPair, MsgPauseBurningAndMinting, MsgPauseSendingAndReceivingMessages, MsgReceiveMessage, MsgRemoveRemoteTokenMessenger, MsgReplaceDepositForBurn, MsgReplaceMessage, MsgSendMessage, MsgSendMessageWithCaller, MsgUnlinkTokenPair, MsgUnpauseBurningAndMinting, MsgUnpauseSendingAndReceivingMessages, MsgUpdateOwner, MsgUpdateAttesterManager, MsgUpdateTokenController, MsgUpdatePauser, MsgUpdateMaxMessageBodySize, MsgSetMaxBurnAmountPerMessage, MsgUpdateSignatureThreshold } from "./tx";
export const AminoConverter = {
  "/circle.cctp.v1.MsgAcceptOwner": {
    aminoType: "cctp/AcceptOwner",
    toAmino: MsgAcceptOwner.toAmino,
    fromAmino: MsgAcceptOwner.fromAmino
  },
  "/circle.cctp.v1.MsgAddRemoteTokenMessenger": {
    aminoType: "cctp/AddRemoteTokenMessenger",
    toAmino: MsgAddRemoteTokenMessenger.toAmino,
    fromAmino: MsgAddRemoteTokenMessenger.fromAmino
  },
  "/circle.cctp.v1.MsgDepositForBurn": {
    aminoType: "cctp/DepositForBurn",
    toAmino: MsgDepositForBurn.toAmino,
    fromAmino: MsgDepositForBurn.fromAmino
  },
  "/circle.cctp.v1.MsgDepositForBurnWithCaller": {
    aminoType: "cctp/DepositForBurnWithCaller",
    toAmino: MsgDepositForBurnWithCaller.toAmino,
    fromAmino: MsgDepositForBurnWithCaller.fromAmino
  },
  "/circle.cctp.v1.MsgDisableAttester": {
    aminoType: "cctp/DisableAttester",
    toAmino: MsgDisableAttester.toAmino,
    fromAmino: MsgDisableAttester.fromAmino
  },
  "/circle.cctp.v1.MsgEnableAttester": {
    aminoType: "cctp/EnableAttester",
    toAmino: MsgEnableAttester.toAmino,
    fromAmino: MsgEnableAttester.fromAmino
  },
  "/circle.cctp.v1.MsgLinkTokenPair": {
    aminoType: "cctp/LinkTokenPair",
    toAmino: MsgLinkTokenPair.toAmino,
    fromAmino: MsgLinkTokenPair.fromAmino
  },
  "/circle.cctp.v1.MsgPauseBurningAndMinting": {
    aminoType: "cctp/PauseBurningAndMinting",
    toAmino: MsgPauseBurningAndMinting.toAmino,
    fromAmino: MsgPauseBurningAndMinting.fromAmino
  },
  "/circle.cctp.v1.MsgPauseSendingAndReceivingMessages": {
    aminoType: "cctp/PauseSendingAndReceivingMessages",
    toAmino: MsgPauseSendingAndReceivingMessages.toAmino,
    fromAmino: MsgPauseSendingAndReceivingMessages.fromAmino
  },
  "/circle.cctp.v1.MsgReceiveMessage": {
    aminoType: "cctp/ReceiveMessage",
    toAmino: MsgReceiveMessage.toAmino,
    fromAmino: MsgReceiveMessage.fromAmino
  },
  "/circle.cctp.v1.MsgRemoveRemoteTokenMessenger": {
    aminoType: "cctp/RemoveRemoteTokenMessenger",
    toAmino: MsgRemoveRemoteTokenMessenger.toAmino,
    fromAmino: MsgRemoveRemoteTokenMessenger.fromAmino
  },
  "/circle.cctp.v1.MsgReplaceDepositForBurn": {
    aminoType: "cctp/ReplaceDepositForBurn",
    toAmino: MsgReplaceDepositForBurn.toAmino,
    fromAmino: MsgReplaceDepositForBurn.fromAmino
  },
  "/circle.cctp.v1.MsgReplaceMessage": {
    aminoType: "cctp/ReplaceMessage",
    toAmino: MsgReplaceMessage.toAmino,
    fromAmino: MsgReplaceMessage.fromAmino
  },
  "/circle.cctp.v1.MsgSendMessage": {
    aminoType: "cctp/SendMessage",
    toAmino: MsgSendMessage.toAmino,
    fromAmino: MsgSendMessage.fromAmino
  },
  "/circle.cctp.v1.MsgSendMessageWithCaller": {
    aminoType: "cctp/SendMessageWithCaller",
    toAmino: MsgSendMessageWithCaller.toAmino,
    fromAmino: MsgSendMessageWithCaller.fromAmino
  },
  "/circle.cctp.v1.MsgUnlinkTokenPair": {
    aminoType: "cctp/UnlinkTokenPair",
    toAmino: MsgUnlinkTokenPair.toAmino,
    fromAmino: MsgUnlinkTokenPair.fromAmino
  },
  "/circle.cctp.v1.MsgUnpauseBurningAndMinting": {
    aminoType: "cctp/UnpauseBurningAndMinting",
    toAmino: MsgUnpauseBurningAndMinting.toAmino,
    fromAmino: MsgUnpauseBurningAndMinting.fromAmino
  },
  "/circle.cctp.v1.MsgUnpauseSendingAndReceivingMessages": {
    aminoType: "cctp/UnpauseSendingAndReceivingMessages",
    toAmino: MsgUnpauseSendingAndReceivingMessages.toAmino,
    fromAmino: MsgUnpauseSendingAndReceivingMessages.fromAmino
  },
  "/circle.cctp.v1.MsgUpdateOwner": {
    aminoType: "cctp/UpdateOwner",
    toAmino: MsgUpdateOwner.toAmino,
    fromAmino: MsgUpdateOwner.fromAmino
  },
  "/circle.cctp.v1.MsgUpdateAttesterManager": {
    aminoType: "cctp/UpdateAttesterManager",
    toAmino: MsgUpdateAttesterManager.toAmino,
    fromAmino: MsgUpdateAttesterManager.fromAmino
  },
  "/circle.cctp.v1.MsgUpdateTokenController": {
    aminoType: "cctp/UpdateTokenController",
    toAmino: MsgUpdateTokenController.toAmino,
    fromAmino: MsgUpdateTokenController.fromAmino
  },
  "/circle.cctp.v1.MsgUpdatePauser": {
    aminoType: "cctp/UpdatePauser",
    toAmino: MsgUpdatePauser.toAmino,
    fromAmino: MsgUpdatePauser.fromAmino
  },
  "/circle.cctp.v1.MsgUpdateMaxMessageBodySize": {
    aminoType: "cctp/UpdateMaxMessageBodySize",
    toAmino: MsgUpdateMaxMessageBodySize.toAmino,
    fromAmino: MsgUpdateMaxMessageBodySize.fromAmino
  },
  "/circle.cctp.v1.MsgSetMaxBurnAmountPerMessage": {
    aminoType: "cctp/SetMaxBurnAmountPerMessage",
    toAmino: MsgSetMaxBurnAmountPerMessage.toAmino,
    fromAmino: MsgSetMaxBurnAmountPerMessage.fromAmino
  },
  "/circle.cctp.v1.MsgUpdateSignatureThreshold": {
    aminoType: "cctp/UpdateSignatureThreshold",
    toAmino: MsgUpdateSignatureThreshold.toAmino,
    fromAmino: MsgUpdateSignatureThreshold.fromAmino
  }
};