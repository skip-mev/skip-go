import { OfflineSigner, isOfflineDirectSigner } from "@cosmjs/proto-signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { getAccountNumberAndSequence } from "../getAccountNumberAndSequence";
import { SignerGetters, ValidateGasResult } from "src/client-v2/state";
import { CosmosMsg } from "src/client-v2/types/swaggerTypes";
import { TransactionCallbacks } from "src/client-v2/types/callbacks";
import { SigningStargateClient } from "@cosmjs/stargate/build/signingstargateclient";
import { GasOptions } from "src/client-v2/types/client";
import { signCosmosMessageDirect } from "./signCosmosMessageDirect";
import { signCosmosMessageAmino } from "./signCosmosMessageAmino";

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
};
