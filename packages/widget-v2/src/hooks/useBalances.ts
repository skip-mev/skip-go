import {
  BalanceResponseChainEntry,
  BalanceResponseDenomEntry,
  Chain,
} from "@skip-go/client";
import * as token from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { createPublicClient, erc20Abi, http, PublicClient } from "viem";

import { multicall3ABI } from "../constants/abis";
import { useAtomValue } from "jotai";
import { endpointOptions } from "@/constants/skipClientDefault";
import { config } from "@/constants/wagmi";
import { StargateClient } from "@cosmjs/stargate";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {
  ClientAsset,
  skipAssetsAtom,
  skipChainsAtom,
} from "@/state/skipClient";
import { useAccount } from "wagmi";
import { useGetAccount } from "./useGetAccount";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import pMap from "p-map";
import { skipAllBalancesRequestAtom } from "@/state/balances";
import { useMemo } from "react";

const STARGATE_CLIENTS: Record<string, StargateClient> = {};
const COSMWASM_CLIENTS: Record<string, CosmWasmClient> = {};

type Args = {
  enabled?: boolean;
};

export function useBalances({ enabled = true }: Args) {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const { chainId: evmChainId } = useAccount();
  const balReq = useAtomValue(skipAllBalancesRequestAtom);
  const getAccount = useGetAccount();

  const evmChainsToFetch = chains?.filter((chain) => {
    return (
      balReq &&
      Object.keys(balReq.chains).includes(chain.chainID) &&
      chain.chainType === "evm"
    );
  });
  const cosmosChainsToFetch = chains?.filter((chain) => {
    return (
      balReq &&
      Object.keys(balReq.chains).includes(chain.chainID) &&
      chain.chainType === "cosmos"
    );
  });
  const cosmosCW20ChainsToFetch = chains?.filter((chain) => {
    return (
      balReq &&
      Object.keys(balReq.chains).includes(chain.chainID) &&
      chain.chainType === "cosmos" &&
      assets?.some((a) => a.isCW20 && a.chainID === chain.chainID)
    );
  });
  const svmChainsToFetch = chains?.filter((chain) => {
    return (
      balReq &&
      Object.keys(balReq.chains).includes(chain.chainID) &&
      chain.chainType === "svm"
    );
  });

  const evmBalancesQuery = useQuery({
    queryKey: [
      "USE_BALANCES_EVM_CHAIN",
      evmChainsToFetch,
      chains,
      assets,
      evmChainId,
    ],
    queryFn: async () => {
      if (!assets || !chains || !evmChainsToFetch)
        throw new Error("Assets or chains not found");
      const balances: Record<string, BalanceResponseChainEntry> = {};
      const fetchBalance = async (chain: Chain) => {
        const address =
          chain.chainType === "evm" && evmChainId
            ? getAccount(String(evmChainId))?.address
            : undefined;
        if (!address) return;
        const publicClient = createPublicClient({
          chain: config.chains.find((i) => i.id === Number(chain.chainID)),
          transport: http(),
        });
        const balance = await getEvmChainBalances(
          publicClient,
          address,
          chain.chainID,
          assets.filter((a) => a.isEVM && a.chainID === chain.chainID)
        );
        if (Object.values(balance.denoms).length > 0) {
          balances[chain.chainID] = balance;
        }
      };
      await pMap(evmChainsToFetch, fetchBalance, { concurrency: Infinity });
      return balances;
    },
    enabled: !!evmChainsToFetch && !!assets && !!chains && enabled,
    refetchInterval: 1000 * 60,
    retry: 1,
    gcTime: 0,
  });

  const cosmosBalancesQuery = useQuery({
    queryKey: [
      "USE_BALANCES_COSMOS_CHAIN",
      cosmosChainsToFetch,
      chains,
      assets,
    ],
    queryFn: async () => {
      if (!assets || !chains || !cosmosChainsToFetch)
        throw new Error("Assets or chains not found");
      const balances: Record<string, BalanceResponseChainEntry> = {};
      const fetchBalance = async (chain: Chain) => {
        const rpcURL = await endpointOptions?.getRpcEndpointForChain?.(
          chain.chainID
        );
        const account = getAccount(chain.chainID);
        if (!account?.address) return;
        const balance = await getCosmosBalances(
          rpcURL,
          account.address,
          chain.chainID,
          assets.filter(
            (a) => !a.isEVM && !a.isSVM && a.chainID === chain.chainID
          )
        );
        if (Object.values(balance.denoms).length > 0) {
          balances[chain.chainID] = balance;
        }
      };
      await pMap(cosmosChainsToFetch, fetchBalance, { concurrency: Infinity });
      return balances;
    },
    enabled: !!cosmosChainsToFetch && !!assets && !!chains && enabled,
  });

  const cosmosCW20BalancesQuery = useQuery({
    queryKey: [
      "USE_BALANCES_COSMOS_CW20_CHAIN",
      cosmosCW20ChainsToFetch,
      chains,
      assets,
    ],
    queryFn: async () => {
      if (!assets || !chains || !cosmosCW20ChainsToFetch)
        throw new Error("Assets or chains not found");
      const balances: Record<string, BalanceResponseChainEntry> = {};
      const fetchBalance = async (chain: Chain) => {
        const rpcURL = await endpointOptions?.getRpcEndpointForChain?.(
          chain.chainID
        );
        const account = getAccount(chain.chainID);
        if (!account?.address) return;
        const balance = await getCosmosCW20Balances(
          rpcURL,
          account.address,
          chain.chainID,
          assets.filter(
            (a) =>
              !a.isEVM && !a.isSVM && a.chainID === chain.chainID && a.isCW20
          )
        );
        if (Object.values(balance.denoms).length > 0) {
          balances[chain.chainID] = balance;
        }
      };
      await pMap(cosmosCW20ChainsToFetch, fetchBalance, {
        concurrency: Infinity,
      });
      return balances;
    },
    enabled: !!cosmosCW20ChainsToFetch && !!assets && !!chains && enabled,
    refetchInterval: 1000 * 60,
    retry: 1,
    gcTime: 0,
  });

  const svmBalancesQuery = useQuery({
    queryKey: ["USE_BALANCES_SVM_CHAIN", svmChainsToFetch, chains, assets],
    queryFn: async () => {
      if (!assets || !chains || !svmChainsToFetch)
        throw new Error("Assets or chains not found");
      const balances: Record<string, BalanceResponseChainEntry> = {};
      const fetchBalance = async (chain: Chain) => {
        const rpcURL = await endpointOptions?.getRpcEndpointForChain?.(
          chain.chainID
        );
        const account = getAccount(chain.chainID);
        if (!account?.address) return;
        const balance = await getSvmChainBalances(
          rpcURL,
          account.address,
          chain.chainID,
          assets.filter((a) => a.isSVM && a.chainID === chain.chainID)
        );
        if (Object.values(balance.denoms).length > 0) {
          balances[chain.chainID] = balance;
        }
      };
      await pMap(svmChainsToFetch, fetchBalance, { concurrency: Infinity });
      return balances;
    },
    enabled: !!svmChainsToFetch && !!assets && !!chains && enabled,
    refetchInterval: 1000 * 60,
    retry: 1,
    gcTime: 0,
  });

  const mergedCosmosBalances = useMemo(() => {
    const allCosmosBalances: Record<string, BalanceResponseChainEntry> = {};
    if (cosmosBalancesQuery.data) {
      Object.keys(cosmosBalancesQuery.data).forEach((chainID) => {
        if (!allCosmosBalances[chainID]) {
          allCosmosBalances[chainID] = cosmosBalancesQuery.data[chainID];
        } else {
          allCosmosBalances[chainID] = {
            ...allCosmosBalances[chainID],
            denoms: {
              ...allCosmosBalances[chainID].denoms,
              ...cosmosBalancesQuery.data[chainID].denoms,
            },
          };
        }
      });
    }
    if (cosmosCW20BalancesQuery.data) {
      Object.keys(cosmosCW20BalancesQuery.data).forEach((chainID) => {
        if (!allCosmosBalances[chainID]) {
          allCosmosBalances[chainID] = cosmosCW20BalancesQuery.data[chainID];
        } else {
          allCosmosBalances[chainID] = {
            ...allCosmosBalances[chainID],
            denoms: {
              ...allCosmosBalances[chainID].denoms,
              ...cosmosCW20BalancesQuery.data[chainID].denoms,
            },
          };
        }
      });
    }
    return allCosmosBalances;
  }, [cosmosBalancesQuery.data, cosmosCW20BalancesQuery.data]);

  const result = useMemo(() => {
    return {
      data: {
        ...evmBalancesQuery.data,
        ...mergedCosmosBalances,
        ...svmBalancesQuery.data,
      },
      isLoading:
        evmBalancesQuery.isLoading ||
        cosmosBalancesQuery.isLoading ||
        cosmosCW20BalancesQuery.isLoading ||
        svmBalancesQuery.isLoading,
      isError:
        evmBalancesQuery.isError ||
        cosmosBalancesQuery.isError ||
        cosmosCW20BalancesQuery.isError ||
        svmBalancesQuery.isError,
      isFetching:
        evmBalancesQuery.isFetching ||
        cosmosBalancesQuery.isFetching ||
        cosmosCW20BalancesQuery.isFetching ||
        svmBalancesQuery.isFetching,
      refetch: () => {
        evmBalancesQuery.refetch();
        cosmosBalancesQuery.refetch();
        cosmosCW20BalancesQuery.refetch();
        svmBalancesQuery.refetch();
      },
    };
  }, [
    cosmosBalancesQuery,
    cosmosCW20BalancesQuery,
    evmBalancesQuery,
    mergedCosmosBalances,
    svmBalancesQuery,
  ]);

  return result;
}

export function useBalancesByChain2({
  enabled = true,
}: Args): UseQueryResult<
  Record<string, BalanceResponseChainEntry> | undefined
> {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const { chainId: evmChainId } = useAccount();
  const balReq = useAtomValue(skipAllBalancesRequestAtom);
  const getAccount = useGetAccount();

  return useQuery({
    queryKey: ["USE_BALANCES_BY_CHAIN", balReq],
    queryFn: async () => {
      if (!assets || !chains || !balReq)
        throw new Error("Assets or chains not found");
      const balances: Record<string, BalanceResponseChainEntry> = {};
      const fetchBalance = async (chain: Chain) => {
        const rpcURL = await endpointOptions?.getRpcEndpointForChain?.(
          chain.chainID
        );
        if (chain.chainType === "evm") {
          const isEVM = chain?.chainType === "evm";
          const address =
            isEVM && evmChainId
              ? getAccount(String(evmChainId))?.address
              : undefined;
          if (!address) return;
          const publicClient = createPublicClient({
            chain: config.chains.find((i) => i.id === Number(chain.chainID)),
            transport: http(),
          });
          const balance = await getEvmChainBalances(
            publicClient,
            address,
            chain.chainID,
            assets.filter((a) => a.isEVM && a.chainID === chain.chainID)
          );
          if (Object.values(balance.denoms).length > 0) {
            balances[chain.chainID] = balance;
          }
        }
        if (chain.chainType === "cosmos" && rpcURL) {
          const account = getAccount(chain.chainID);
          if (!account?.address) return;
          const balance = await getCosmosBalances(
            rpcURL,
            account.address,
            chain.chainID,
            assets.filter(
              (a) => !a.isEVM && !a.isSVM && a.chainID === chain.chainID
            )
          );
          if (Object.values(balance.denoms).length > 0) {
            balances[chain.chainID] = balance;
          }
        }
        if (chain.chainType === "svm" && rpcURL) {
          const account = getAccount(chain.chainID);
          if (!account?.address) return;
          const balance = await getSvmChainBalances(
            rpcURL,
            account.address,
            chain.chainID,
            assets.filter((a) => a.isSVM && a.chainID === chain.chainID)
          );
          if (Object.values(balance.denoms).length > 0) {
            balances[chain.chainID] = balance;
          }
        }
      };

      const chainsToFetch = chains.filter((chain) => {
        return Object.keys(balReq?.chains).includes(chain.chainID);
      });
      await pMap(chainsToFetch, fetchBalance, { concurrency: Infinity });

      return balances;
    },
    enabled: !!chains && !!assets && !!balReq && enabled,
  });
}

export async function getCosmosBalances(
  rpcURL: string,
  address: string,
  chainID: string,
  assets: ClientAsset[]
) {
  const getStargateClient = async () => {
    if (STARGATE_CLIENTS[chainID]) {
      return STARGATE_CLIENTS[chainID];
    }
    const client = await StargateClient.connect(rpcURL);
    return (STARGATE_CLIENTS[chainID] = client), client;
  };

  const stargate = await getStargateClient();
  const balances = await stargate.getAllBalances(address);

  const allBalances = balances.reduce<Record<string, string>>(
    (acc, balance) => ({ ...acc, [balance.denom]: balance.amount }),
    {}
  );

  const denoms: Record<string, BalanceResponseDenomEntry> = {};

  assets.forEach((asset) => {
    if (!allBalances[asset.denom]) return;
    denoms[asset.denom] = {
      amount: allBalances[asset.denom] || "0",
      formattedAmount: convertTokenAmountToHumanReadableAmount(
        allBalances[asset.denom] || "0",
        asset.decimals
      ),
      decimals: asset.decimals,
    };
  });

  return {
    address,
    denoms,
  };
}

export async function getCosmosCW20Balances(
  rpcURL: string,
  address: string,
  chainID: string,
  assets: ClientAsset[]
) {
  const getCosmWasmClient = async () => {
    if (COSMWASM_CLIENTS[chainID]) {
      return COSMWASM_CLIENTS[chainID];
    }
    const client = await CosmWasmClient.connect(rpcURL);
    return (COSMWASM_CLIENTS[chainID] = client), client;
  };
  const cosmwasm = await getCosmWasmClient();

  const _cw20Balances = await pMap(
    assets,
    async (asset) => {
      try {
        if (!asset.tokenContract) {
          throw new Error("Token contract not found");
        }
        return await cosmwasm.queryContractSmart(asset.tokenContract, {
          balance: { address },
        });
      } catch (e) {
        return e;
      }
    },
    { concurrency: Infinity }
  );
  const cw20Balances = _cw20Balances.filter(
    (result) => !(result instanceof Error)
  );

  const denoms: Record<string, BalanceResponseDenomEntry> = {};

  cw20Balances.forEach((data, index) => {
    const asset = assets[index];
    if (data.balance !== "0") {
      denoms[asset.denom] = {
        amount: data.balance,
        formattedAmount: convertTokenAmountToHumanReadableAmount(
          data.balance,
          asset.decimals
        ),
        decimals: asset.decimals,
      };
    }
  });
  return {
    address,
    denoms,
  };
}

export async function getEvmChainBalances(
  publicClient: PublicClient,
  address: string,
  chainID: string,
  assets: ClientAsset[]
) {
  const isForma = chainID === "984122";
  const multicallAddress = (
    isForma
      ? "0xd53C6FFB123F7349A32980F87faeD8FfDc9ef079"
      : "0xcA11bde05977b3631167028862bE2a173976CA11"
  ) as `0x${string}`;
  const balances = await publicClient.multicall({
    multicallAddress,
    contracts: assets.map((asset) => {
      if (!asset.tokenContract) {
        return {
          address: multicallAddress,
          abi: multicall3ABI,
          functionName: "getEthBalance",
          args: [address as `0x${string}`],
        };
      }
      return {
        address: asset.tokenContract as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      };
    }),
  });
  const denoms: Record<string, BalanceResponseDenomEntry> = {};

  balances.forEach((balance, i) => {
    const asset = assets[i];
    if (!balance.result) return;
    denoms[asset.denom] = {
      amount: balance.result?.toString() || "0",
      formattedAmount:
        balance.result && asset.decimals
          ? convertTokenAmountToHumanReadableAmount(
            balance.result?.toString(),
            asset.decimals
          )
          : "0",
      decimals: asset.decimals,
    };
  });

  return {
    address,
    denoms,
  };
}

export const getSvmChainBalances = async (
  rpcUrl: string,
  address: string,
  chainID: string,
  assets: ClientAsset[]
) => {
  const connection = new Connection(rpcUrl);
  // get SOL balance
  const solBalance = await connection.getBalance(new PublicKey(address));
  // solana-devnet
  const allBalances: Record<string, string> = {};
  if (chainID === "solana-devnet") {
    allBalances["solana-devnet-native"] = solBalance.toString();
  }
  // solana-mainnet
  if (chainID === "solana") {
    allBalances["solana-native"] = solBalance.toString();
  }

  const _splTokenBalances = await Promise.all(
    assets
      .filter((i) => i.denom !== "solana-devnet-native")
      .map(async (asset) => {
        try {
          const tokenAddress = await token.getAssociatedTokenAddress(
            new PublicKey(asset.denom),
            new PublicKey(address)
          );
          const tokenBalance = await token.getAccount(connection, tokenAddress);
          return {
            denom: asset.denom,
            amount: tokenBalance.amount.toString(),
          };
        } catch (e) {
          return e;
        }
      })
  );
  const splTokenBalances = _splTokenBalances.filter(
    (result) => !(result instanceof Error)
  ) as {
    denom: string;
    amount: string;
  }[];

  splTokenBalances.forEach((balance) => {
    if (balance instanceof Error) return;
    allBalances[balance.denom] = balance.amount;
  });

  const denoms: Record<string, BalanceResponseDenomEntry> = {};

  assets.forEach((asset) => {
    if (!allBalances[asset.denom]) return;
    denoms[asset.denom] = {
      amount: allBalances[asset.denom] || "0",
      formattedAmount: convertTokenAmountToHumanReadableAmount(
        allBalances[asset.denom] || "0",
        asset.decimals
      ),
      decimals: asset.decimals,
    };
  });
  return {
    address,
    denoms,
  };
};
