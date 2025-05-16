// TODO: This is previously existing code, just moved to a new function.
// Using signCosmosMessageDirectEvmos on evmos DOES currently fail.

import type { StdFee } from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import type { OfflineDirectSigner } from "@cosmjs/proto-signing";
import type { SignerData } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import type { TxRaw as TxRawType } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";

import type { CosmosMsg } from "src/types/swaggerTypes";
import { getEncodeObjectFromCosmosMessageInjective } from "./getEncodeObjectFromCosmosMessage";
import { createTransaction } from "src/injective";

// I need to investigate what exactly is even different about this and hopefully remove it all together.
export const signCosmosMessageDirectEvmos = async (
  signerAddress: string,
  signer: OfflineDirectSigner,
  cosmosMsgs: CosmosMsg[],
  fee: StdFee,
  { accountNumber, sequence, chainId }: SignerData,
): Promise<TxRawType> => {
  const accounts = await signer.getAccounts();
  const accountFromSigner = accounts.find((account) => account.address === signerAddress);

  if (!accountFromSigner) {
    throw new Error("signCosmosMessageDirectEvmos: failed to retrieve account from signer");
  }

  const messages = cosmosMsgs.map((cosmosMsg) =>
    getEncodeObjectFromCosmosMessageInjective(cosmosMsg),
  );

  const pk = Buffer.from(accountFromSigner.pubkey).toString("base64");

  const { signDoc } = createTransaction({
    pubKey: pk,
    chainId: chainId,
    message: messages,
    sequence,
    accountNumber,
    timeoutHeight: 0,
    fee,
  });

  // @ts-expect-error TODO: Fix this
  const directSignResponse = await signer.signDirect(signerAddress, signDoc);

  return TxRaw.fromPartial({
    bodyBytes: directSignResponse.signed.bodyBytes,
    authInfoBytes: directSignResponse.signed.authInfoBytes,
    signatures: [fromBase64(directSignResponse.signature.signature)],
  });
};
