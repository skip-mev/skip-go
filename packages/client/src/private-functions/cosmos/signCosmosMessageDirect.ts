import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import type { TxRaw as TxRawType } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import { signCosmosMessageDirectEvmos } from "./signCosmosMessageDirectEvmos";
import { signCosmosMessageDirectInjective } from "./signCosmosMessageDirectInjective";
import type { TxBodyEncodeObject } from "@cosmjs/proto-signing";
import { makeAuthInfoBytes, makeSignDoc } from "@cosmjs/proto-signing";
import { makePubkeyAnyFromAccount } from "src/proto-signing/pubkey";
import { fromBase64 } from "@cosmjs/encoding";
import { Int53 } from "@cosmjs/math";
import { ClientState } from "src/state/clientState";
import { getEncodeObjectFromCosmosMessage } from "./getEncodeObjectFromCosmosMessage";
import type { SignCosmosMessageDirectOptions } from "src/types/client-types";

export const signCosmosMessageDirect = async (
  options: SignCosmosMessageDirectOptions,
): Promise<TxRawType> => {
  const {
    signer,
    signerAddress,
    chainId,
    cosmosMsgs,
    fee,
    signerData: { accountNumber, sequence, chainId: signerChainId },
  } = options;

  if (chainId.includes("evmos")) {
    return signCosmosMessageDirectEvmos(signerAddress, signer, cosmosMsgs, fee, {
      accountNumber,
      sequence,
      chainId: signerChainId,
    });
  }

  if (chainId.includes("injective")) {
    return signCosmosMessageDirectInjective(signerAddress, signer, cosmosMsgs, fee, {
      accountNumber,
      sequence,
      chainId: signerChainId,
    });
  }

  const accounts = await signer.getAccounts();
  const accountFromSigner = accounts.find((account) => account.address === signerAddress);

  if (!accountFromSigner) {
    throw new Error("signCosmosMessageDirect error: failed to retrieve account from signer");
  }

  const messages = cosmosMsgs.map((cosmosMsg) => getEncodeObjectFromCosmosMessage(cosmosMsg, chainId));

  const txBodyEncodeObject: TxBodyEncodeObject = {
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: {
      messages: messages,
    },
  };

  const txBodyBytes = ClientState.registry.encode(txBodyEncodeObject);

  const gasLimit = Int53.fromString(fee.gas).toNumber();

  const pubkeyAny = makePubkeyAnyFromAccount(accountFromSigner, chainId);

  const authInfoBytes = makeAuthInfoBytes(
    [{ pubkey: pubkeyAny, sequence }],
    fee.amount,
    gasLimit,
    fee.granter,
    fee.payer,
  );

  const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);

  const { signature, signed } = await signer.signDirect(signerAddress, signDoc);

  return TxRaw.fromPartial({
    bodyBytes: signed.bodyBytes,
    authInfoBytes: signed.authInfoBytes,
    signatures: [fromBase64(signature.signature)],
  });
};
