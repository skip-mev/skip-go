import { FeeAsset } from '@skip-router/core';
import { chainRecord } from '../chains/chains';

import { GasPrice } from '@cosmjs/stargate';
import { chainIdToName } from '../chains';
/**
 * - deprio denoms start with 'ibc/' and 'factory/'
 * - prio denoms start with 'u' or 'uu'
 */
export function sortFeeAssets(a: FeeAsset, b: FeeAsset) {
  const aIsDeprio =
    a.denom.startsWith('ibc/') || a.denom.startsWith('factory/');
  const bIsDeprio =
    b.denom.startsWith('ibc/') || b.denom.startsWith('factory/');
  const aIsPrio = a.denom.startsWith('u') || a.denom.startsWith('uu');
  const bIsPrio = b.denom.startsWith('u') || b.denom.startsWith('uu');

  if (aIsDeprio && !bIsDeprio) return 1;
  if (!aIsDeprio && bIsDeprio) return -1;
  if (aIsPrio && !bIsPrio) return -1;
  if (!aIsPrio && bIsPrio) return 1;

  return 0;
}

export const getChainFeeAssets = (chainID: string) => {
  const { fees } = chainRecord[chainID];
  const feeAssets: FeeAsset[] =
    fees?.fee_tokens.map((ft) => ({
      denom: ft.denom,
      gasPrice: {
        low: (ft.low_gas_price ?? 0.01).toString(),
        average: (ft.average_gas_price ?? 0.025).toString(),
        high: (ft.high_gas_price ?? 0.04).toString(),
      },
    })) ?? [];
  return feeAssets;
};

export const getChainGasPrice = (chainID: string) => {
  const { fees } = chainRecord[chainID];
  const ft = fees?.fee_tokens?.[0];
  if (!(ft && ft.average_gas_price && ft.denom)) return null;
  const gas = `${ft.average_gas_price}${ft.denom}`;
  return GasPrice.fromString(gas);
};

export const getRpcUrl = (chainID: string) => {
  if (chainID === 'solana-devnet') {
    return 'https://api.devnet.solana.com';
  }
  if (chainID === 'solana') {
    return 'https://api.mainnet-beta.solana.com';
  }
  const chainPath = chainIdToName[chainID];
  const cosmosDirectoryRPC = `https://rpc.cosmos.directory/${chainPath}`;
  return cosmosDirectoryRPC;
};
