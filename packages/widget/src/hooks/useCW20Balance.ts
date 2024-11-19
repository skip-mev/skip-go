import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {
  ClientAsset, skipClientConfigAtom,
} from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { getChainInfo } from "graz";

const COSMWASM_CLIENTS: Record<string, CosmWasmClient> = {};

export const useCW20Balance = ({
  asset,
  address,
}: {
  address?: string,
  asset: ClientAsset
}) => {
  const skipClientConfig = useAtomValue(skipClientConfigAtom)
  const query = useQuery({
    queryKey: ["cw20Balance", { denom: asset.denom, address }],
    queryFn: async () => {
      const rpcURL = await skipClientConfig.endpointOptions?.getRpcEndpointForChain?.(asset.chainID) || getChainInfo({
        chainId: asset.chainID,
      })?.rpc
      if (!rpcURL) throw new Error("RPC URL not found");
      if (!address) throw new Error("Address not found");
      return getCosmosCW20Balance(rpcURL, address, asset);
    },
    enabled: !!address && !!asset.tokenContract && !!asset.isCW20,
  })
  return query;
}

export async function getCosmosCW20Balance(
  rpcURL: string,
  address: string,
  asset: ClientAsset
) {
  if (!asset.tokenContract) throw new Error("Token contract not found");
  const getCosmWasmClient = async () => {
    if (COSMWASM_CLIENTS[asset.chainID]) {
      return COSMWASM_CLIENTS[asset.chainID];
    }
    const client = await CosmWasmClient.connect(rpcURL);
    return (COSMWASM_CLIENTS[asset.chainID] = client), client;
  };
  const cosmwasm = await getCosmWasmClient();

  const cw20Balance = await cosmwasm.queryContractSmart(asset.tokenContract, {
    balance: { address },
  });

  return {
    amount: cw20Balance.balance,
    formattedAmount: convertTokenAmountToHumanReadableAmount(
      cw20Balance.balance,
      asset.decimals
    ),
    decimals: asset.decimals,
  }
}
