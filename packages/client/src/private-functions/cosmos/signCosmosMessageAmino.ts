import { TxRaw } from "cosmjs-types/cosmos";
import { getEncodeObjectFromCosmosMessage } from "./getEncodeObjectFromCosmosMessage";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { ClientState } from "src/state/clientState";
import { makeSignDoc } from "@cosmjs/amino";
import { TxBodyEncodeObject } from "@cosmjs/proto-signing/build/registry";
import { Int53 } from "@cosmjs/math/build/integers";
import { makePubkeyAnyFromAccount } from "src/proto-signing/pubkey";
import { makeAuthInfoBytes } from "@cosmjs/proto-signing/build/signing";
import { fromBase64 } from "@cosmjs/encoding/build/base64";
import { SignCosmosMessageAminoOptions } from "src/types/client-types";

export const signCosmosMessageAmino = async (
  options: SignCosmosMessageAminoOptions,
): Promise<TxRaw> => {
  const {
    signer,
    signerAddress,
    chainId,
    cosmosMsgs,
    fee,
    signerData: { accountNumber, sequence, chainId: signerChainId },
  } = options;

  const accounts = await signer.getAccounts();
  const accountFromSigner = accounts.find((account) => account.address === signerAddress);

  if (!accountFromSigner) {
    throw new Error("signCosmosMessageAmino: failed to retrieve account from signer");
  }

  const messages = cosmosMsgs.map((cosmosMsg) => getEncodeObjectFromCosmosMessage(cosmosMsg));

  const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
  const msgs = messages.map((msg) => ClientState.aminoTypes.toAmino(msg));

  console.log("sign cosmos message amino", msgs, fee, signerChainId, "", accountNumber, sequence);

  const signDoc = makeSignDoc(msgs, fee, signerChainId, "", accountNumber, sequence);

  const { signature, signed } = await signer.signAmino(signerAddress, signDoc);

  const signedTxBody = {
    messages: signed.msgs.map((msg) => ClientState.aminoTypes.fromAmino(msg)),
    memo: signed.memo,
  };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  signedTxBody.messages[0]!.value.memo = messages[0]!.value.memo;

  const signedTxBodyEncodeObject: TxBodyEncodeObject = {
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: signedTxBody,
  };

  const signedTxBodyBytes = ClientState.registry.encode(signedTxBodyEncodeObject);

  const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
  const signedSequence = Int53.fromString(signed.sequence).toNumber();

  const pubkeyAny = makePubkeyAnyFromAccount(accountFromSigner, chainId);

  const signedAuthInfoBytes = makeAuthInfoBytes(
    [{ pubkey: pubkeyAny, sequence: signedSequence }],
    signed.fee.amount,
    signedGasLimit,
    signed.fee.granter,
    signed.fee.payer,
    signMode,
  );

  return TxRaw.fromPartial({
    bodyBytes: signedTxBodyBytes,
    authInfoBytes: signedAuthInfoBytes,
    signatures: [fromBase64(signature.signature)],
  });
};
