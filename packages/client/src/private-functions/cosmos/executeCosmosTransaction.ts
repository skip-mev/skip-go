import { ClientState } from "../../state/clientState";
import { getSigningStargateClient } from "../../public-functions/getSigningStargateClient";
import type { CosmosTx } from "../../types/swaggerTypes";
import { getAccountNumberAndSequence } from "../getAccountNumberAndSequence";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import type { TxRaw as TxRawType } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import { isOfflineDirectSigner } from "@cosmjs/proto-signing";
import { signCosmosMessageDirect } from "./signCosmosMessageDirect";
import { signCosmosMessageAmino } from "./signCosmosMessageAmino";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { submit } from "src/api/postSubmit";
import { signCosmosTransaction } from "./signCosmosTransaction";

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
  if (tx === undefined) {
    throw new Error("executeCosmosTransaction error: tx is undefined");
  }
  const rawTxBase64 = await signCosmosTransaction({
    tx,
    options,
    index,
  });
  const chainId = tx.cosmosTx?.chainId;

  const txResponse = await submit({
    chainId,
    tx: rawTxBase64,
  });

  return {
    chainId: tx?.cosmosTx?.chainId ?? "",
    txHash: txResponse?.txHash ?? "",
  };
};
