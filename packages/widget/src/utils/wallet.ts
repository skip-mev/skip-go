import { ChainWalletBase } from '@cosmos-kit/core';
import { MergedWalletClient } from '../lib/cosmos-kit';

export async function gracefullyConnect(
  wallet: ChainWalletBase,
  {
    onAddChainError = console.error,
  }: {
    onAddChainError?: (err: unknown) => void | Promise<void>;
  } = {}
) {
  const client = wallet.client as MergedWalletClient;
  if (client && 'addChain' in client) {
    await client
      ?.addChain?.({
        chain: {
          bech32_prefix: wallet.chain.bech32_prefix,
          chain_id: wallet.chain.chain_id,
          chain_name: wallet.chain.chain_name,
          network_type: wallet.chain.network_type,
          pretty_name: wallet.chain.pretty_name,
          slip44: wallet.chain.slip44,
          status: wallet.chain.status,
          apis: wallet.chain.apis,
          bech32_config: wallet.chain.bech32_config,
          explorers: wallet.chain.explorers,
          extra_codecs: wallet.chain.extra_codecs,
          fees: wallet.chain.fees,
          peers: wallet.chain.peers,
        },
        name: wallet.chainName,
        assetList: wallet.assetList,
      })
      .catch(onAddChainError);
  }
  await wallet.connect();
}

export async function isWalletClientUsingLedger<T extends MergedWalletClient>(
  walletClient: T,
  chainID: string
) {
  if (!('client' in walletClient)) {
    return false;
  }

  // Keplr | Leap | Okxwallet | Vectis | XDEFI
  if ('getKey' in walletClient.client) {
    const key = await walletClient.client.getKey(chainID);
    return key.isNanoLedger;
  }

  // Station
  if ('keplr' in walletClient.client) {
    const key = await walletClient.client.keplr.getKey(chainID);
    return key.isNanoLedger;
  }

  // Cosmostation
  if ('cosmos' in walletClient.client) {
    const account = await walletClient.client.cosmos.request({
      method: 'cos_account',
      params: { chainName: chainID },
    });
    return Boolean(account.isLedger);
  }

  return false;
}

export function isReadyToCheckLedger<T extends MergedWalletClient>(
  walletClient: T
) {
  if (!('client' in walletClient)) {
    return false;
  }

  // Keplr | Leap | Okxwallet | Vectis | XDEFI
  if ('getKey' in walletClient.client) {
    return true;
  }

  // Station
  if ('keplr' in walletClient.client) {
    return true;
  }

  // Cosmostation
  if ('cosmos' in walletClient.client) {
    return true;
  }

  return false;
}
