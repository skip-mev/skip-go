import { ClientState } from "../../state/clientState";
import { getSigningStargateClient } from "../../public-functions/getSigningStargateClient";
import type { CosmosTx } from "../../types/swaggerTypes";
import { getAccountNumberAndSequence } from "../getAccountNumberAndSequence";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import type { TxRaw as TxRawType } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { isOfflineDirectSigner } from "@cosmjs/proto-signing/build/signer";
import { signCosmosMessageDirect } from "./signCosmosMessageDirect";
import { signCosmosMessageAmino } from "./signCosmosMessageAmino";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";

type ExecuteCosmosTransactionProps = {
  tx?: {
    cosmosTx?: CosmosTx;
    operationsIndices?: number[];
  };
  options: ExecuteRouteOptions;
  index: number;
};

export const executeCosmosTransaction = async ({
  tx,
  options,
  index,
}: ExecuteCosmosTransactionProps) => {
  const { userAddresses } = options;

  if (tx === undefined) {
    throw new Error("executeCosmosTransaction error: tx is undefined");
  }

  const chainId = tx.cosmosTx?.chainId;
  const messages = tx.cosmosTx?.msgs;
  const currentUserAddress = userAddresses.find((x) => x.chainId === tx.cosmosTx?.chainId)?.address;

  const gasArray = ClientState.validateGasResults;
  const gas = gasArray?.find((gas) => gas?.error !== null && gas?.error !== undefined);
  if (typeof gas?.error === "string") {
    throw new Error(gas?.error);
  }

  const gasUsed = gasArray?.[index];
  if (!gasUsed) {
    throw new Error(`executeRoute error: invalid gas at index ${index}`);
  }

  if (chainId === undefined) {
    throw new Error("no chainId found for tx");
  }

  if (messages === undefined) {
    throw new Error("no messages found for tx");
  }

  const { stargateClient, signer } = await getSigningStargateClient({
    chainId: chainId,
    getOfflineSigner: options?.getCosmosSigner,
  });

  if (!currentUserAddress) {
    throw new Error(
      `executeCosmosTransaction error: invalid address for chain '${tx.cosmosTx?.chainId}'`,
    );
  }

  const accounts = await signer.getAccounts();
  const accountFromSigner = accounts.find((account) => account.address === currentUserAddress);

  if (!accountFromSigner) {
    throw new Error("executeCosmosTransaction error: failed to retrieve account from signer");
  }

  const fee = gasUsed?.fee;

  if (!fee) {
    throw new Error("executeCosmosTransaction error: failed to retrieve fee from gas");
  }

  const { accountNumber, sequence } = await getAccountNumberAndSequence(
    currentUserAddress,
    chainId,
  );

  let rawTx: TxRawType;

  const commonRawTxBody = {
    signerAddress: currentUserAddress,
    chainId,
    cosmosMsgs: messages,
    fee,
    signerData: {
      accountNumber,
      sequence,
      chainId,
    },
  };

  if (isOfflineDirectSigner(signer)) {
    rawTx = await signCosmosMessageDirect({
      ...commonRawTxBody,
      signer,
    });
  } else {
    rawTx = await signCosmosMessageAmino({ ...commonRawTxBody, signer });
  }

  options?.onTransactionSigned?.({
    chainId,
  });

  const txBytes = TxRaw.encode(rawTx).finish();

  const txResponse = await stargateClient.broadcastTx(txBytes);

  return {
    chainId: tx?.cosmosTx?.chainId ?? "",
    txHash: txResponse.transactionHash,
  };
};
