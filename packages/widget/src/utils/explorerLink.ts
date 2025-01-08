import { explorers } from "@/constants/chains";
import { config } from "@/constants/wagmi";
import { ChainType } from "@skip-go/client";

export const createExplorerLink = ({
  chainID,
  txHash,
  chainType,
}: {
  chainID?: string;
  chainType?: string;
  txHash: string;
}) => {
  if (!chainType || !chainID) return undefined;
  switch (chainType) {
    case ChainType.Cosmos: {
      const chain = explorers.find((chain) => chain.chainId === chainID);
      const mintscan = chain?.explorers?.find((explorer) => explorer.kind === "mintscan");
      const explorer = mintscan || chain?.explorers?.[0];
      const url = explorer?.tx_page?.replace("${txHash}", txHash);
      return url;
    }
    case ChainType.EVM: {
      const chain = config.chains.find((chain) => chain.id === Number(chainID));
      const url = chain?.blockExplorers?.default.url;
      return url ? `${url}/tx/${txHash}` : undefined;
    }
    case ChainType.SVM: {
      return `https://solscan.io/tx/${txHash}`;
    }
    default:
      return undefined;
  }
};
