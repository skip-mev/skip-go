import type { CosmosTx } from "../../types/swaggerTypes";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";

import { signCosmosTransaction } from "./signCosmosTransaction";
import { submitTransaction } from "src/api/postSubmitTransaction";
import { updateRouteDetails } from "src/public-functions/subscribeToRouteStatus";

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

  const txResponse = await submitTransaction({
    chainId,
    tx: rawTxBase64,
  });

  return {
    chainId: tx?.cosmosTx?.chainId ?? "",
    txHash: txResponse?.txHash ?? "",
    explorerLink: txResponse?.explorerLink ?? '',
  };
};
