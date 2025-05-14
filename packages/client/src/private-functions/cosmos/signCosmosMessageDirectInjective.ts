// TODO: This is previously existing code, just moved to a new function.
// Using signCosmosMessageDirectInjective on injective DOES currently fail.

import type { StdFee } from "@cosmjs/amino/build/signdoc";
import type { OfflineDirectSigner } from "@cosmjs/proto-signing/build/signer";
import type { SignerData } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import type { TxRaw as TxRawType } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import type { CosmosMsg } from "src/types/swaggerTypes";
import { getRestEndpointForChain } from "../getRestEndpointForChain";
import { getEncodeObjectFromCosmosMessageInjective } from "./getEncodeObjectFromCosmosMessage";
import { createTransaction } from "src/injective";
import { fromBase64 } from "@cosmjs/encoding/build/base64";
import { BigNumberInBase, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from "@injectivelabs/utils";
import { ChainRestTendermintApi } from "@injectivelabs/sdk-ts";

// I need to investigate what exactly is even different about this and hopefully remove it all together.
export const signCosmosMessageDirectInjective = async (
  signerAddress: string,
  signer: OfflineDirectSigner,
  cosmosMsgs: CosmosMsg[],
  fee: StdFee,
  { accountNumber, sequence, chainId }: SignerData,
): Promise<TxRawType> => {
  const accounts = await signer.getAccounts();
  const accountFromSigner = accounts.find((account) => account.address === signerAddress);

  if (!accountFromSigner) {
    throw new Error("signCosmosMessageDirectInjective: failed to retrieve account from signer");
  }

  const restEndpoint = await getRestEndpointForChain(chainId);

  /** Block Details */
  const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
  const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
  const latestHeight = latestBlock.header.height;
  const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT);
  const pk = Buffer.from(accountFromSigner.pubkey).toString("base64");
  const messages = cosmosMsgs.map((cosmosMsg) =>
    getEncodeObjectFromCosmosMessageInjective(cosmosMsg),
  );
  const { signDoc } = createTransaction({
    pubKey: pk,
    chainId: chainId,
    message: messages,
    sequence,
    accountNumber,
    timeoutHeight: timeoutHeight.toNumber(),
    fee,
  });

  const directSignResponse = await signer.signDirect(
    signerAddress,
    // @ts-expect-error TODO: Fix this
    signDoc,
  );

  return TxRaw.fromPartial({
    bodyBytes: directSignResponse.signed.bodyBytes,
    authInfoBytes: directSignResponse.signed.authInfoBytes,
    signatures: [fromBase64(directSignResponse.signature.signature)],
  });
};
