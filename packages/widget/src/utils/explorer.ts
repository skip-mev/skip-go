import { EVM_CHAINS } from '../constants/wagmi';
import { explorersRecord } from '../chains/explorers';

export interface ChainExplorerResponse {
  evm: boolean;
  explorer: string;
}

export function getExplorerUrl(chainId: string) {
  let baseUrl: string | undefined;
  const parsedIntId = parseInt(chainId);
  const isEvmChain = typeof parsedIntId === 'number' && !isNaN(parsedIntId);

  const isSvmChain = chainId === 'solana-devnet' || chainId === 'solana';

  if (isSvmChain) {
    baseUrl =
      chainId === 'solana-devnet'
        ? 'https://solscan.io/tx/${txHash}?cluster=devnet'
        : 'https://solscan.io/tx/${txHash}';
  }

  if (isEvmChain) {
    const chain = EVM_CHAINS.find((chain) => chain.id === parseInt(chainId));
    if (chain?.blockExplorers?.default.url) {
      baseUrl = chain.blockExplorers!.default.url;
    }
  } else {
    const explorers = explorersRecord[chainId] || [];

    baseUrl ||= explorers.find(
      (explorer) => explorer.kind === 'mintscan'
    )?.tx_page;
    baseUrl ||= explorers[0]?.tx_page;
  }

  if (!baseUrl) {
    return null;
  }

  const payload: ChainExplorerResponse = {
    evm: isEvmChain,
    explorer: baseUrl,
  };

  const { evm, explorer } = payload;
  if (evm) {
    return (txHash: string) => `${explorer}/tx/${txHash}`;
  } else {
    return (txHash: string) => `${explorer.replace('${txHash}', txHash)}`;
  }
}
