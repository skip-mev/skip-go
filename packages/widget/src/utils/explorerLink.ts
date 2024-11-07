import { config } from "@/constants/wagmi";
import { chains } from "@/state/chains";

export const createExplorerLink = ({ chainID, txHash, chainType }: { chainID: string, chainType?: string, txHash: string }) => {
  if (!chainType) return undefined
  switch (chainType) {
    case "cosmos":
      {
        const chain = chains.find((chain) => chain.chain_id === chainID);
        const mintscan = chain?.explorers?.find((explorer) => explorer.kind === "mintscan");
        const explorer = mintscan || chain?.explorers?.[0];
        const url = explorer?.tx_page?.replace("${txHash}", txHash);
        return url
      }
    case "evm": {
      const chain = config.chains.find((chain) => chain.id === Number(chainID));
      const url = chain?.blockExplorers?.default.url
      return url ? `${url}/tx/${txHash}` : undefined
    }
    case "svm": {
      return `https://solscan.io/tx/${txHash}`
    }
    default:
      return undefined
  }
}
