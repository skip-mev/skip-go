import { ClientState } from "../../state";
import { getSigningStargateClient } from "../getSigningStargateClient";
import { CosmosTx } from "../../types/swaggerTypes";
import { ExecuteRouteOptions } from "../executeRoute";
import { executeCosmosMessage } from "./executeCosmosMessage";

type ExecuteCosmosTransactionProps = {
  tx: {
    cosmosTx: CosmosTx;
    operationsIndices: number[];
  };
  options: ExecuteRouteOptions;
  index: number;
};

export const executeCosmosTransaction = async ({
  tx,
  options,
  index,
}: ExecuteCosmosTransactionProps) => {
  const { userAddresses, getCosmosSigner } = options;

  const gasArray = ClientState.validateGasResults;
  const gas = gasArray?.find((gas) => gas?.error !== null && gas?.error !== undefined);
  if (typeof gas?.error === "string") {
    throw new Error(gas?.error);
  }

  const gasUsed = gasArray?.[index];
  if (!gasUsed) {
    throw new Error(`executeRoute error: invalid gas at index ${index}`);
  }

  if (tx.cosmosTx.chainId === undefined) {
    throw new Error("no chainId found for tx");
  }

  if (tx.cosmosTx.msgs === undefined) {
    throw new Error("no messages found for tx");
  }

  const { stargateClient, signer } = await getSigningStargateClient({
    chainId: tx.cosmosTx.chainId,
    getOfflineSigner: options.getCosmosSigner,
  });

  const currentUserAddress = userAddresses.find((x) => x.chainID === tx.cosmosTx.chainId)?.address;

  if (!currentUserAddress) {
    throw new Error(`executeRoute error: invalid address for chain '${tx.cosmosTx.chainId}'`);
  }

  const txResponse = await executeCosmosMessage({
    messages: tx.cosmosTx.msgs,
    chainId: tx.cosmosTx.chainId,
    getCosmosSigner,
    signerAddress: currentUserAddress,
    gas: gasUsed,
    stargateClient: stargateClient,
    signer,
    ...options,
  });

  return {
    chainId: tx.cosmosTx.chainId,
    txHash: txResponse.transactionHash,
  };
};
