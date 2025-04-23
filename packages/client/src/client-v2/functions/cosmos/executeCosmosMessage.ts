import { OfflineSigner, isOfflineDirectSigner } from "@cosmjs/proto-signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { getAccountNumberAndSequence } from "../getAccountNumberAndSequence";
import { SignerGetters, ValidateGasResult } from "src/client-v2/state";
import { CosmosMsg } from "src/client-v2/types/swaggerTypes";
import { TransactionCallbacks } from "src/client-v2/types/callbacks";
import { SigningStargateClient } from "@cosmjs/stargate/build/signingstargateclient";
import { GasOptions } from "src/client-v2/types/client";
import { signCosmosMessageDirect } from "./signCosmosMessageDirect";

export type ExecuteCosmosMessageProps = GasOptions & {
  signerAddress: string;
  getCosmosSigner?: SignerGetters["getCosmosSigner"];
  chainId: string;
  messages: CosmosMsg[];
  gas: ValidateGasResult;
  onTransactionSigned?: TransactionCallbacks["onTransactionSigned"];
  onTransactionBroadcast?: TransactionCallbacks["onTransactionBroadcast"];
};

export const executeCosmosMessage = async (
  options: ExecuteCosmosMessageProps & {
    stargateClient: SigningStargateClient;
    signer: OfflineSigner;
  },
) => {
  const { signerAddress, chainId, messages, gas, onTransactionSigned, stargateClient, signer } =
    options;

  const accounts = await signer.getAccounts();
  const accountFromSigner = accounts.find((account) => account.address === signerAddress);

  if (!accountFromSigner) {
    throw new Error("executeCosmosMessage error: failed to retrieve account from signer");
  }

  const fee = gas.fee;
  if (!fee) {
    throw new Error("executeCosmosMessage error: failed to retrieve fee from gas");
  }

  const { accountNumber, sequence } = await getAccountNumberAndSequence(signerAddress, chainId);

  let rawTx: TxRaw;

  const commonRawTxBody = {
    signerAddress,
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
    rawTx = await this.signCosmosMessageAmino({ ...commonRawTxBody, signer });
  }

  onTransactionSigned?.({
    chainId,
  });

  const txBytes = TxRaw.encode(rawTx).finish();

  const tx = await stargateClient.broadcastTx(txBytes);

  return tx;
};
