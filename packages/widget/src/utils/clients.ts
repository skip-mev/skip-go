import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import { accountParser } from 'kujira.js';

const STARGATE_CLIENTS: Record<string, StargateClient> = {};

export async function getStargateClientForChainID(chainID: string) {
  if (STARGATE_CLIENTS[chainID]) {
    return STARGATE_CLIENTS[chainID];
  }

  const endpoint = `TODO`;
  const client = await StargateClient.connect(endpoint, {
    accountParser,
  });

  return (STARGATE_CLIENTS[chainID] = client), client;
}

const COSMWASM_CLIENTS: Record<string, CosmWasmClient> = {};

export async function getCosmWasmClientForChainID(chainID: string) {
  if (COSMWASM_CLIENTS[chainID]) {
    return COSMWASM_CLIENTS[chainID];
  }

  const endpoint = `TODO`;
  const client = await CosmWasmClient.connect(endpoint);

  return (COSMWASM_CLIENTS[chainID] = client), client;
}
