import { Asset, SkipRouter } from '@skip-go/core';
import * as token from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { createPublicClient, erc20Abi, http, PublicClient } from 'viem';

import { multicall3ABI } from '../constants/abis';
import { Chain } from './use-chains';
import { useSkipClient, useSkipConfig } from './use-skip-client';
import { EVM_CHAINS } from '../constants/wagmi';
import {
  getCosmWasmClientForChainID,
  getStargateClientForChainID,
} from '../utils/clients';
import { useSwapWidgetUIStore } from '../store/swap-widget';

interface Args {
  address?: string;
  chain?: Chain;
  assets?: Asset[];
  enabled?: boolean;
  solanaRpcUrl?: string;
}

export function useBalancesByChain({
  address,
  chain,
  assets,
  enabled = true,
}: Args): UseQueryResult<Record<string, string> | undefined> {
  // const publicClient = usePublicClient({
  //   chainId: chain?.chainType === "evm" ? parseInt(chain.chainID) : undefined,
  // });
  const skipClient = useSkipClient();
  const config = useSkipConfig();

  return useQuery({
    queryKey: [
      'USE_BALANCES_BY_CHAIN',
      address,
      chain,
      assets,
      useSwapWidgetUIStore.getState().onlyTestnet,
    ],
    queryFn: async () => {
      if (!chain || !address) {
        return {};
      }
      const rpcURL =
        (await config.endpointOptions?.getRpcEndpointForChain?.(
          chain.chainID
        )) || config.endpointOptions?.endpoints?.[chain.chainID].rpc;

      if (chain.chainType === 'evm') {
        const publicClient = createPublicClient({
          chain: EVM_CHAINS.find((i) => i.id === Number(chain.chainID)),
          transport: http(),
        });
        return getEvmChainBalances(
          skipClient,
          publicClient,
          address,
          chain.chainID
        );
      }
      if (chain.chainType === 'cosmos' && rpcURL) {
        return getBalancesByChain(rpcURL, address, chain.chainID, assets ?? []);
      }
      if (chain.chainType === 'svm' && rpcURL) {
        return getSvmChainBalances(
          rpcURL,
          address,
          chain.chainID,
          assets ?? []
        );
      }
    },
    enabled: !!chain && !!address && enabled,
  });
}

export async function getBalancesByChain(
  rpcURL: string,
  address: string,
  chainID: string,
  assets: Asset[]
) {
  const [stargate, cosmwasm] = await Promise.all([
    getStargateClientForChainID(chainID, rpcURL),
    getCosmWasmClientForChainID(chainID, rpcURL),
  ]);
  const balances = await stargate.getAllBalances(address);
  const cw20Assets = assets.filter((asset) => asset.isCW20);
  const _cw20Balances = await Promise.all(
    cw20Assets.map(async (asset) => {
      try {
        return await cosmwasm.queryContractSmart(asset.tokenContract!, {
          balance: { address },
        });
      } catch (e) {
        return e;
      }
    })
  );
  const cw20Balances = _cw20Balances.filter(
    (result) => !(result instanceof Error)
  );

  const allBalances = balances.reduce<Record<string, string>>(
    (acc, balance) => ({ ...acc, [balance.denom]: balance.amount }),
    {}
  );

  cw20Balances.forEach((balance, index) => {
    const asset = cw20Assets[index];
    if (balance.balance !== '0') {
      allBalances[asset.denom] = balance.balance;
    }
  });

  return allBalances;
}

export async function getEvmChainBalances(
  skipClient: SkipRouter,
  publicClient: PublicClient,
  address: string,
  chainID: string
) {
  const assets = await skipClient.assets({
    chainID,
    includeEvmAssets: true,
    onlyTestnets: useSwapWidgetUIStore.getState().onlyTestnet,
  });

  const chainAssets = assets[chainID];

  const isForma = chainID === '984122';
  const balances = await publicClient.multicall({
    multicallAddress: isForma
      ? '0xd53C6FFB123F7349A32980F87faeD8FfDc9ef079'
      : '0xcA11bde05977b3631167028862bE2a173976CA11',
    contracts: chainAssets.map((asset) => {
      if (!asset.tokenContract) {
        return {
          address: isForma
            ? '0xd53C6FFB123F7349A32980F87faeD8FfDc9ef079'
            : ('0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`),
          abi: multicall3ABI,
          functionName: 'getEthBalance',
          args: [address as `0x${string}`],
        };
      }

      return {
        address: asset.tokenContract as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      };
    }),
  });
  return chainAssets.reduce<Record<string, string>>(
    (acc, asset, i) => ({
      ...acc,
      [asset.denom]: balances[i].result?.toString() || '0',
    }),
    {}
  );
}

export const getSvmChainBalances = async (
  rpcUrl: string,
  address: string,
  chainID: string,
  assets: Asset[]
) => {
  const connection = new Connection(rpcUrl);
  // get SOL balance
  const solBalance = await connection.getBalance(new PublicKey(address));
  // solana-devnet
  const allBalances: Record<string, string> = {};
  if (chainID === 'solana-devnet') {
    allBalances['solana-devnet-native'] = solBalance.toString();
  }
  // solana-mainnet
  if (chainID === 'solana') {
    allBalances['solana-native'] = solBalance.toString();
  }

  const _splTokenBalances = await Promise.all(
    assets
      .filter((i) => i.denom !== 'solana-devnet-native')
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

  return allBalances;
};
