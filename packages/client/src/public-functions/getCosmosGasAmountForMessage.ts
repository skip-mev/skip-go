import type { EncodeObject } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import type { CosmosMsg } from "src/types/swaggerTypes";
import { getEncodeObjectFromCosmosMessage } from "../private-functions/cosmos/getEncodeObjectFromCosmosMessage";

export const DEFAULT_GAS_MULTIPLIER = 1.5;

export async function getCosmosGasAmountForMessage(
  client: SigningStargateClient,
  signerAddress: string,
  chainId: string,
  messages?: CosmosMsg[],
  encodedMsgs?: EncodeObject[],
  multiplier: number = DEFAULT_GAS_MULTIPLIER,
) {
  if (!messages && !encodedMsgs) {
    throw new Error("Either message or encodedMsg must be provided");
  }
  const _encodedMsgs = messages?.map((message) => getEncodeObjectFromCosmosMessage(message));
  encodedMsgs = encodedMsgs || _encodedMsgs;

  if (!encodedMsgs) {
    throw new Error("Either message or encodedMsg must be provided");
  }
  if (
    chainId.includes("evmos") ||
    chainId.includes("injective") ||
    chainId.includes("dymension") ||
    chainId.includes("sunrise-1") ||
    process?.env.NODE_ENV === "test"
  ) {
    if (messages?.find((i) => i.msgTypeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract")) {
      return "2400000";
    }
    return "280000";
  }

  const estimatedGas = await client.simulate(signerAddress, encodedMsgs, "");

  const estimatedGasWithBuffer = estimatedGas * multiplier;

  return Math.ceil(estimatedGasWithBuffer).toFixed(0);
}
