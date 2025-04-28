// TODO: This is previously existing code, just moved to a new function.
// Using signCosmosMessageDirectEvmos on evmos DOES currently fail.

import { StdFee } from "@cosmjs/amino/build/signdoc";
import { fromBase64 } from "@cosmjs/encoding/build/base64";
import { OfflineDirectSigner } from "@cosmjs/proto-signing/build/signer";
import { SignerData } from "@cosmjs/stargate/build/signingstargateclient";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { CosmosMsg } from "src/client-v2/types/swaggerTypes";
import { getEncodeObjectFromCosmosMessageInjective } from "../transactions";
import { createTransaction } from "src/injective";

// I need to investigate what exactly is even different about this and hopefully remove it all together.
export const signCosmosMessageDirectEvmos = async (
  signerAddress: string,
  signer: OfflineDirectSigner,
  cosmosMsgs: CosmosMsg[],
  fee: StdFee,
  { accountNumber, sequence, chainId }: SignerData,
): Promise<TxRaw> => {
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
