import { EvmTx } from "src/client-v2/types/swaggerTypes";
import { ExecuteRouteOptions } from "../executeRoute";
import { ClientState } from "src/client-v2/state";
import { executeEVMTransaction } from "./executeEvmTransaction";

export const executeEvmMessage = async (
  message: { evmTx: EvmTx },
  options: ExecuteRouteOptions,
) => {
  const gasArray = ClientState.validateGasResults;

  const gas = gasArray?.find((gas) => gas?.error !== null && gas?.error !== undefined);
  if (typeof gas?.error === "string") {
    throw new Error(gas?.error);
  }

  const { evmTx } = message;

  const getEVMSigner = options.getEVMSigner || ClientState.getEVMSigner;
  if (!getEVMSigner) {
    throw new Error("Unable to get EVM signer");
  }
  if (!evmTx.chainId) {
    throw new Error("chain id not found in evmTx");
  }

  const evmSigner = await getEVMSigner(evmTx.chainId);

  return await executeEVMTransaction({
    message: evmTx,
    signer: evmSigner,
    options,
  });
};
