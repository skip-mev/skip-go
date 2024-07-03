//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgAcceptOwner, MsgAddRemoteTokenMessenger, MsgDepositForBurn, MsgDepositForBurnWithCaller, MsgDisableAttester, MsgEnableAttester, MsgLinkTokenPair, MsgPauseBurningAndMinting, MsgPauseSendingAndReceivingMessages, MsgReceiveMessage, MsgRemoveRemoteTokenMessenger, MsgReplaceDepositForBurn, MsgReplaceMessage, MsgSendMessage, MsgSendMessageWithCaller, MsgUnlinkTokenPair, MsgUnpauseBurningAndMinting, MsgUnpauseSendingAndReceivingMessages, MsgUpdateOwner, MsgUpdateAttesterManager, MsgUpdateTokenController, MsgUpdatePauser, MsgUpdateMaxMessageBodySize, MsgSetMaxBurnAmountPerMessage, MsgUpdateSignatureThreshold } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/circle.cctp.v1.MsgAcceptOwner", MsgAcceptOwner], ["/circle.cctp.v1.MsgAddRemoteTokenMessenger", MsgAddRemoteTokenMessenger], ["/circle.cctp.v1.MsgDepositForBurn", MsgDepositForBurn], ["/circle.cctp.v1.MsgDepositForBurnWithCaller", MsgDepositForBurnWithCaller], ["/circle.cctp.v1.MsgDisableAttester", MsgDisableAttester], ["/circle.cctp.v1.MsgEnableAttester", MsgEnableAttester], ["/circle.cctp.v1.MsgLinkTokenPair", MsgLinkTokenPair], ["/circle.cctp.v1.MsgPauseBurningAndMinting", MsgPauseBurningAndMinting], ["/circle.cctp.v1.MsgPauseSendingAndReceivingMessages", MsgPauseSendingAndReceivingMessages], ["/circle.cctp.v1.MsgReceiveMessage", MsgReceiveMessage], ["/circle.cctp.v1.MsgRemoveRemoteTokenMessenger", MsgRemoveRemoteTokenMessenger], ["/circle.cctp.v1.MsgReplaceDepositForBurn", MsgReplaceDepositForBurn], ["/circle.cctp.v1.MsgReplaceMessage", MsgReplaceMessage], ["/circle.cctp.v1.MsgSendMessage", MsgSendMessage], ["/circle.cctp.v1.MsgSendMessageWithCaller", MsgSendMessageWithCaller], ["/circle.cctp.v1.MsgUnlinkTokenPair", MsgUnlinkTokenPair], ["/circle.cctp.v1.MsgUnpauseBurningAndMinting", MsgUnpauseBurningAndMinting], ["/circle.cctp.v1.MsgUnpauseSendingAndReceivingMessages", MsgUnpauseSendingAndReceivingMessages], ["/circle.cctp.v1.MsgUpdateOwner", MsgUpdateOwner], ["/circle.cctp.v1.MsgUpdateAttesterManager", MsgUpdateAttesterManager], ["/circle.cctp.v1.MsgUpdateTokenController", MsgUpdateTokenController], ["/circle.cctp.v1.MsgUpdatePauser", MsgUpdatePauser], ["/circle.cctp.v1.MsgUpdateMaxMessageBodySize", MsgUpdateMaxMessageBodySize], ["/circle.cctp.v1.MsgSetMaxBurnAmountPerMessage", MsgSetMaxBurnAmountPerMessage], ["/circle.cctp.v1.MsgUpdateSignatureThreshold", MsgUpdateSignatureThreshold]];
export const MessageComposer = {
  encoded: {
    acceptOwner(value: MsgAcceptOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAcceptOwner",
        value: MsgAcceptOwner.encode(value).finish()
      };
    },
    addRemoteTokenMessenger(value: MsgAddRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAddRemoteTokenMessenger",
        value: MsgAddRemoteTokenMessenger.encode(value).finish()
      };
    },
    depositForBurn(value: MsgDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
        value: MsgDepositForBurn.encode(value).finish()
      };
    },
    depositForBurnWithCaller(value: MsgDepositForBurnWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurnWithCaller",
        value: MsgDepositForBurnWithCaller.encode(value).finish()
      };
    },
    disableAttester(value: MsgDisableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDisableAttester",
        value: MsgDisableAttester.encode(value).finish()
      };
    },
    enableAttester(value: MsgEnableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgEnableAttester",
        value: MsgEnableAttester.encode(value).finish()
      };
    },
    linkTokenPair(value: MsgLinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgLinkTokenPair",
        value: MsgLinkTokenPair.encode(value).finish()
      };
    },
    pauseBurningAndMinting(value: MsgPauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseBurningAndMinting",
        value: MsgPauseBurningAndMinting.encode(value).finish()
      };
    },
    pauseSendingAndReceivingMessages(value: MsgPauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseSendingAndReceivingMessages",
        value: MsgPauseSendingAndReceivingMessages.encode(value).finish()
      };
    },
    receiveMessage(value: MsgReceiveMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReceiveMessage",
        value: MsgReceiveMessage.encode(value).finish()
      };
    },
    removeRemoteTokenMessenger(value: MsgRemoveRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgRemoveRemoteTokenMessenger",
        value: MsgRemoveRemoteTokenMessenger.encode(value).finish()
      };
    },
    replaceDepositForBurn(value: MsgReplaceDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceDepositForBurn",
        value: MsgReplaceDepositForBurn.encode(value).finish()
      };
    },
    replaceMessage(value: MsgReplaceMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceMessage",
        value: MsgReplaceMessage.encode(value).finish()
      };
    },
    sendMessage(value: MsgSendMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessage",
        value: MsgSendMessage.encode(value).finish()
      };
    },
    sendMessageWithCaller(value: MsgSendMessageWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessageWithCaller",
        value: MsgSendMessageWithCaller.encode(value).finish()
      };
    },
    unlinkTokenPair(value: MsgUnlinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnlinkTokenPair",
        value: MsgUnlinkTokenPair.encode(value).finish()
      };
    },
    unpauseBurningAndMinting(value: MsgUnpauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseBurningAndMinting",
        value: MsgUnpauseBurningAndMinting.encode(value).finish()
      };
    },
    unpauseSendingAndReceivingMessages(value: MsgUnpauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseSendingAndReceivingMessages",
        value: MsgUnpauseSendingAndReceivingMessages.encode(value).finish()
      };
    },
    updateOwner(value: MsgUpdateOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateOwner",
        value: MsgUpdateOwner.encode(value).finish()
      };
    },
    updateAttesterManager(value: MsgUpdateAttesterManager) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateAttesterManager",
        value: MsgUpdateAttesterManager.encode(value).finish()
      };
    },
    updateTokenController(value: MsgUpdateTokenController) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateTokenController",
        value: MsgUpdateTokenController.encode(value).finish()
      };
    },
    updatePauser(value: MsgUpdatePauser) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdatePauser",
        value: MsgUpdatePauser.encode(value).finish()
      };
    },
    updateMaxMessageBodySize(value: MsgUpdateMaxMessageBodySize) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateMaxMessageBodySize",
        value: MsgUpdateMaxMessageBodySize.encode(value).finish()
      };
    },
    setMaxBurnAmountPerMessage(value: MsgSetMaxBurnAmountPerMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSetMaxBurnAmountPerMessage",
        value: MsgSetMaxBurnAmountPerMessage.encode(value).finish()
      };
    },
    updateSignatureThreshold(value: MsgUpdateSignatureThreshold) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateSignatureThreshold",
        value: MsgUpdateSignatureThreshold.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    acceptOwner(value: MsgAcceptOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAcceptOwner",
        value
      };
    },
    addRemoteTokenMessenger(value: MsgAddRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAddRemoteTokenMessenger",
        value
      };
    },
    depositForBurn(value: MsgDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
        value
      };
    },
    depositForBurnWithCaller(value: MsgDepositForBurnWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurnWithCaller",
        value
      };
    },
    disableAttester(value: MsgDisableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDisableAttester",
        value
      };
    },
    enableAttester(value: MsgEnableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgEnableAttester",
        value
      };
    },
    linkTokenPair(value: MsgLinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgLinkTokenPair",
        value
      };
    },
    pauseBurningAndMinting(value: MsgPauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseBurningAndMinting",
        value
      };
    },
    pauseSendingAndReceivingMessages(value: MsgPauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseSendingAndReceivingMessages",
        value
      };
    },
    receiveMessage(value: MsgReceiveMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReceiveMessage",
        value
      };
    },
    removeRemoteTokenMessenger(value: MsgRemoveRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgRemoveRemoteTokenMessenger",
        value
      };
    },
    replaceDepositForBurn(value: MsgReplaceDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceDepositForBurn",
        value
      };
    },
    replaceMessage(value: MsgReplaceMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceMessage",
        value
      };
    },
    sendMessage(value: MsgSendMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessage",
        value
      };
    },
    sendMessageWithCaller(value: MsgSendMessageWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessageWithCaller",
        value
      };
    },
    unlinkTokenPair(value: MsgUnlinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnlinkTokenPair",
        value
      };
    },
    unpauseBurningAndMinting(value: MsgUnpauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseBurningAndMinting",
        value
      };
    },
    unpauseSendingAndReceivingMessages(value: MsgUnpauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseSendingAndReceivingMessages",
        value
      };
    },
    updateOwner(value: MsgUpdateOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateOwner",
        value
      };
    },
    updateAttesterManager(value: MsgUpdateAttesterManager) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateAttesterManager",
        value
      };
    },
    updateTokenController(value: MsgUpdateTokenController) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateTokenController",
        value
      };
    },
    updatePauser(value: MsgUpdatePauser) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdatePauser",
        value
      };
    },
    updateMaxMessageBodySize(value: MsgUpdateMaxMessageBodySize) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateMaxMessageBodySize",
        value
      };
    },
    setMaxBurnAmountPerMessage(value: MsgSetMaxBurnAmountPerMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSetMaxBurnAmountPerMessage",
        value
      };
    },
    updateSignatureThreshold(value: MsgUpdateSignatureThreshold) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateSignatureThreshold",
        value
      };
    }
  },
  toJSON: {
    acceptOwner(value: MsgAcceptOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAcceptOwner",
        value: MsgAcceptOwner.toJSON(value)
      };
    },
    addRemoteTokenMessenger(value: MsgAddRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAddRemoteTokenMessenger",
        value: MsgAddRemoteTokenMessenger.toJSON(value)
      };
    },
    depositForBurn(value: MsgDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
        value: MsgDepositForBurn.toJSON(value)
      };
    },
    depositForBurnWithCaller(value: MsgDepositForBurnWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurnWithCaller",
        value: MsgDepositForBurnWithCaller.toJSON(value)
      };
    },
    disableAttester(value: MsgDisableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDisableAttester",
        value: MsgDisableAttester.toJSON(value)
      };
    },
    enableAttester(value: MsgEnableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgEnableAttester",
        value: MsgEnableAttester.toJSON(value)
      };
    },
    linkTokenPair(value: MsgLinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgLinkTokenPair",
        value: MsgLinkTokenPair.toJSON(value)
      };
    },
    pauseBurningAndMinting(value: MsgPauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseBurningAndMinting",
        value: MsgPauseBurningAndMinting.toJSON(value)
      };
    },
    pauseSendingAndReceivingMessages(value: MsgPauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseSendingAndReceivingMessages",
        value: MsgPauseSendingAndReceivingMessages.toJSON(value)
      };
    },
    receiveMessage(value: MsgReceiveMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReceiveMessage",
        value: MsgReceiveMessage.toJSON(value)
      };
    },
    removeRemoteTokenMessenger(value: MsgRemoveRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgRemoveRemoteTokenMessenger",
        value: MsgRemoveRemoteTokenMessenger.toJSON(value)
      };
    },
    replaceDepositForBurn(value: MsgReplaceDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceDepositForBurn",
        value: MsgReplaceDepositForBurn.toJSON(value)
      };
    },
    replaceMessage(value: MsgReplaceMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceMessage",
        value: MsgReplaceMessage.toJSON(value)
      };
    },
    sendMessage(value: MsgSendMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessage",
        value: MsgSendMessage.toJSON(value)
      };
    },
    sendMessageWithCaller(value: MsgSendMessageWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessageWithCaller",
        value: MsgSendMessageWithCaller.toJSON(value)
      };
    },
    unlinkTokenPair(value: MsgUnlinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnlinkTokenPair",
        value: MsgUnlinkTokenPair.toJSON(value)
      };
    },
    unpauseBurningAndMinting(value: MsgUnpauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseBurningAndMinting",
        value: MsgUnpauseBurningAndMinting.toJSON(value)
      };
    },
    unpauseSendingAndReceivingMessages(value: MsgUnpauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseSendingAndReceivingMessages",
        value: MsgUnpauseSendingAndReceivingMessages.toJSON(value)
      };
    },
    updateOwner(value: MsgUpdateOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateOwner",
        value: MsgUpdateOwner.toJSON(value)
      };
    },
    updateAttesterManager(value: MsgUpdateAttesterManager) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateAttesterManager",
        value: MsgUpdateAttesterManager.toJSON(value)
      };
    },
    updateTokenController(value: MsgUpdateTokenController) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateTokenController",
        value: MsgUpdateTokenController.toJSON(value)
      };
    },
    updatePauser(value: MsgUpdatePauser) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdatePauser",
        value: MsgUpdatePauser.toJSON(value)
      };
    },
    updateMaxMessageBodySize(value: MsgUpdateMaxMessageBodySize) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateMaxMessageBodySize",
        value: MsgUpdateMaxMessageBodySize.toJSON(value)
      };
    },
    setMaxBurnAmountPerMessage(value: MsgSetMaxBurnAmountPerMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSetMaxBurnAmountPerMessage",
        value: MsgSetMaxBurnAmountPerMessage.toJSON(value)
      };
    },
    updateSignatureThreshold(value: MsgUpdateSignatureThreshold) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateSignatureThreshold",
        value: MsgUpdateSignatureThreshold.toJSON(value)
      };
    }
  },
  fromJSON: {
    acceptOwner(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAcceptOwner",
        value: MsgAcceptOwner.fromJSON(value)
      };
    },
    addRemoteTokenMessenger(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAddRemoteTokenMessenger",
        value: MsgAddRemoteTokenMessenger.fromJSON(value)
      };
    },
    depositForBurn(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
        value: MsgDepositForBurn.fromJSON(value)
      };
    },
    depositForBurnWithCaller(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurnWithCaller",
        value: MsgDepositForBurnWithCaller.fromJSON(value)
      };
    },
    disableAttester(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDisableAttester",
        value: MsgDisableAttester.fromJSON(value)
      };
    },
    enableAttester(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgEnableAttester",
        value: MsgEnableAttester.fromJSON(value)
      };
    },
    linkTokenPair(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgLinkTokenPair",
        value: MsgLinkTokenPair.fromJSON(value)
      };
    },
    pauseBurningAndMinting(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseBurningAndMinting",
        value: MsgPauseBurningAndMinting.fromJSON(value)
      };
    },
    pauseSendingAndReceivingMessages(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseSendingAndReceivingMessages",
        value: MsgPauseSendingAndReceivingMessages.fromJSON(value)
      };
    },
    receiveMessage(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReceiveMessage",
        value: MsgReceiveMessage.fromJSON(value)
      };
    },
    removeRemoteTokenMessenger(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgRemoveRemoteTokenMessenger",
        value: MsgRemoveRemoteTokenMessenger.fromJSON(value)
      };
    },
    replaceDepositForBurn(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceDepositForBurn",
        value: MsgReplaceDepositForBurn.fromJSON(value)
      };
    },
    replaceMessage(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceMessage",
        value: MsgReplaceMessage.fromJSON(value)
      };
    },
    sendMessage(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessage",
        value: MsgSendMessage.fromJSON(value)
      };
    },
    sendMessageWithCaller(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessageWithCaller",
        value: MsgSendMessageWithCaller.fromJSON(value)
      };
    },
    unlinkTokenPair(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnlinkTokenPair",
        value: MsgUnlinkTokenPair.fromJSON(value)
      };
    },
    unpauseBurningAndMinting(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseBurningAndMinting",
        value: MsgUnpauseBurningAndMinting.fromJSON(value)
      };
    },
    unpauseSendingAndReceivingMessages(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseSendingAndReceivingMessages",
        value: MsgUnpauseSendingAndReceivingMessages.fromJSON(value)
      };
    },
    updateOwner(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateOwner",
        value: MsgUpdateOwner.fromJSON(value)
      };
    },
    updateAttesterManager(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateAttesterManager",
        value: MsgUpdateAttesterManager.fromJSON(value)
      };
    },
    updateTokenController(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateTokenController",
        value: MsgUpdateTokenController.fromJSON(value)
      };
    },
    updatePauser(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdatePauser",
        value: MsgUpdatePauser.fromJSON(value)
      };
    },
    updateMaxMessageBodySize(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateMaxMessageBodySize",
        value: MsgUpdateMaxMessageBodySize.fromJSON(value)
      };
    },
    setMaxBurnAmountPerMessage(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSetMaxBurnAmountPerMessage",
        value: MsgSetMaxBurnAmountPerMessage.fromJSON(value)
      };
    },
    updateSignatureThreshold(value: any) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateSignatureThreshold",
        value: MsgUpdateSignatureThreshold.fromJSON(value)
      };
    }
  },
  fromPartial: {
    acceptOwner(value: MsgAcceptOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAcceptOwner",
        value: MsgAcceptOwner.fromPartial(value)
      };
    },
    addRemoteTokenMessenger(value: MsgAddRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgAddRemoteTokenMessenger",
        value: MsgAddRemoteTokenMessenger.fromPartial(value)
      };
    },
    depositForBurn(value: MsgDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
        value: MsgDepositForBurn.fromPartial(value)
      };
    },
    depositForBurnWithCaller(value: MsgDepositForBurnWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDepositForBurnWithCaller",
        value: MsgDepositForBurnWithCaller.fromPartial(value)
      };
    },
    disableAttester(value: MsgDisableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgDisableAttester",
        value: MsgDisableAttester.fromPartial(value)
      };
    },
    enableAttester(value: MsgEnableAttester) {
      return {
        typeUrl: "/circle.cctp.v1.MsgEnableAttester",
        value: MsgEnableAttester.fromPartial(value)
      };
    },
    linkTokenPair(value: MsgLinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgLinkTokenPair",
        value: MsgLinkTokenPair.fromPartial(value)
      };
    },
    pauseBurningAndMinting(value: MsgPauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseBurningAndMinting",
        value: MsgPauseBurningAndMinting.fromPartial(value)
      };
    },
    pauseSendingAndReceivingMessages(value: MsgPauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgPauseSendingAndReceivingMessages",
        value: MsgPauseSendingAndReceivingMessages.fromPartial(value)
      };
    },
    receiveMessage(value: MsgReceiveMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReceiveMessage",
        value: MsgReceiveMessage.fromPartial(value)
      };
    },
    removeRemoteTokenMessenger(value: MsgRemoveRemoteTokenMessenger) {
      return {
        typeUrl: "/circle.cctp.v1.MsgRemoveRemoteTokenMessenger",
        value: MsgRemoveRemoteTokenMessenger.fromPartial(value)
      };
    },
    replaceDepositForBurn(value: MsgReplaceDepositForBurn) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceDepositForBurn",
        value: MsgReplaceDepositForBurn.fromPartial(value)
      };
    },
    replaceMessage(value: MsgReplaceMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgReplaceMessage",
        value: MsgReplaceMessage.fromPartial(value)
      };
    },
    sendMessage(value: MsgSendMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessage",
        value: MsgSendMessage.fromPartial(value)
      };
    },
    sendMessageWithCaller(value: MsgSendMessageWithCaller) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSendMessageWithCaller",
        value: MsgSendMessageWithCaller.fromPartial(value)
      };
    },
    unlinkTokenPair(value: MsgUnlinkTokenPair) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnlinkTokenPair",
        value: MsgUnlinkTokenPair.fromPartial(value)
      };
    },
    unpauseBurningAndMinting(value: MsgUnpauseBurningAndMinting) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseBurningAndMinting",
        value: MsgUnpauseBurningAndMinting.fromPartial(value)
      };
    },
    unpauseSendingAndReceivingMessages(value: MsgUnpauseSendingAndReceivingMessages) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUnpauseSendingAndReceivingMessages",
        value: MsgUnpauseSendingAndReceivingMessages.fromPartial(value)
      };
    },
    updateOwner(value: MsgUpdateOwner) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateOwner",
        value: MsgUpdateOwner.fromPartial(value)
      };
    },
    updateAttesterManager(value: MsgUpdateAttesterManager) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateAttesterManager",
        value: MsgUpdateAttesterManager.fromPartial(value)
      };
    },
    updateTokenController(value: MsgUpdateTokenController) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateTokenController",
        value: MsgUpdateTokenController.fromPartial(value)
      };
    },
    updatePauser(value: MsgUpdatePauser) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdatePauser",
        value: MsgUpdatePauser.fromPartial(value)
      };
    },
    updateMaxMessageBodySize(value: MsgUpdateMaxMessageBodySize) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateMaxMessageBodySize",
        value: MsgUpdateMaxMessageBodySize.fromPartial(value)
      };
    },
    setMaxBurnAmountPerMessage(value: MsgSetMaxBurnAmountPerMessage) {
      return {
        typeUrl: "/circle.cctp.v1.MsgSetMaxBurnAmountPerMessage",
        value: MsgSetMaxBurnAmountPerMessage.fromPartial(value)
      };
    },
    updateSignatureThreshold(value: MsgUpdateSignatureThreshold) {
      return {
        typeUrl: "/circle.cctp.v1.MsgUpdateSignatureThreshold",
        value: MsgUpdateSignatureThreshold.fromPartial(value)
      };
    }
  }
};