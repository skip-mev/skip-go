import { ClientState } from "../../state";
import { getSigningStargateClient } from "../../public-functions/getSigningStargateClient";
import { CosmosTx } from "../../types/swaggerTypes";
import { getAccountNumberAndSequence } from "../getAccountNumberAndSequence";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { isOfflineDirectSigner } from "@cosmjs/proto-signing/build/signer";
import { signCosmosMessageDirect } from "./signCosmosMessageDirect";
import { signCosmosMessageAmino } from "./signCosmosMessageAmino";
import { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { AminoSigner } from "@interchainjs/cosmos/signers/amino";
import { SigningClient } from "@interchainjs/cosmos/signing-client";
import {
  ICosmosGenericOfflineSigner,
  OfflineAminoSigner,
  OfflineDirectSigner,
} from "@interchainjs/cosmos/types/wallet";
import { toEncoders } from "@interchainjs/cosmos/utils";
import { getEncodeObjectFromCosmosMessage } from "./getEncodeObjectFromCosmosMessage";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import { AminoConverter } from "@cosmjs/stargate";

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

  // const { stargateClient, signer } = await getSigningStargateClient({
  //   chainId: chainId,
  //   getOfflineSigner: options?.getCosmosSigner,
  // });

  if (!currentUserAddress) {
    throw new Error(
      `executeCosmosTransaction error: invalid address for chain '${tx.cosmosTx?.chainId}'`,
    );
  }

  // const accounts = await signer.getAccounts();

  // const accountFromSigner = accounts.find((account) => account.address === currentUserAddress);

  // if (!accountFromSigner) {
  //   throw new Error("executeCosmosTransaction error: failed to retrieve account from signer");
  // }

  const fee = gasUsed?.fee;

  if (!fee) {
    throw new Error("executeCosmosTransaction error: failed to retrieve fee from gas");
  }

  const { accountNumber, sequence } = await getAccountNumberAndSequence(
    currentUserAddress,
    chainId,
  );

  let rawTx: TxRaw;

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

  const cosmosSigner = (await options?.getCosmosSigner?.(chainId)) as ICosmosGenericOfflineSigner;

  const endpoint = await getRpcEndpointForChain(chainId);

  console.log(cosmosSigner);

  const signer = await SigningClient.connectWithSigner(endpoint, cosmosSigner);

  const registry = Object.assign({}, ClientState.registry) as any;
  const encoders = Array.from(registry.types).map((registry) => registry?.[1]);
  signer.addEncoders(encoders);

  const aminoTypes = Object.assign({}, ClientState.aminoTypes) as any;
  console.log(aminoTypes);
  const converters = Object.entries(aminoTypes.register).map(([typeUrl, converter]) => ({
    typeUrl,
    ...(converter as AminoConverter),
  }));

  console.log(converters);
  signer.addConverters(converters);

  // if (message.msgTypeUrl === "/circle.cctp.v1.MsgDepositForBurnWithCaller") {
  //   return {
  //     typeUrl: message.msgTypeUrl,
  //     value: MsgDepositForBurnWithCaller.fromAmino(msgJson),
  //   };
  // }

  console.log("got signer", signer);

  const encodeObjectMessages = messages.map((cosmosMsg) =>
    getEncodeObjectFromCosmosMessage(cosmosMsg),
  );

  console.log(currentUserAddress, encodeObjectMessages);

  const txResponse = await signer.signAndBroadcast(
    currentUserAddress,
    encodeObjectMessages,
    "auto",
  );

  // if (isOfflineDirectSigner(signer)) {
  //   rawTx = await signCosmosMessageDirect({
  //     ...commonRawTxBody,
  //     signer,
  //   });
  // } else {
  //   const cosmosSigner = await options?.getCosmosSigner?.(tx.cosmosTx?.chainId ?? "");
  //   if (cosmosSigner) {
  //     const signDirect = cosmosSigner as OfflineDirectSigner;
  //     const signAmino = cosmosSigner as OfflineAminoSigner;
  //     if (signDirect?.signDirect !== undefined) {
  //       signDirect.sign = signDirect.signDirect;
  //     }
  //     if (signer?.signAmino) {
  //       signer.sign = signer.signAmino;
  //     }

  //     console.log(client);
  //   }

  //   rawTx = await signCosmosMessageAmino({ ...commonRawTxBody, signer });
  // }

  options?.onTransactionSigned?.({
    chainId,
  });

  // const txBytes = TxRaw.encode(rawTx).finish();

  // const txResponse = await stargateClient.broadcastTx(txBytes);

  return {
    chainId: tx?.cosmosTx?.chainId ?? "",
    txHash: txResponse.transactionHash,
  };
};
