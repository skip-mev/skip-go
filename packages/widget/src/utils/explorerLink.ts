import { explorers } from "@/constants/chains";
import { config } from "@/constants/wagmi";
import { ChainType, TransactionDetails } from "@skip-go/client";
import { jotaiStore } from "@/widget/Widget";
import { onlyTestnetsAtom } from "@/state/skipClient";

export const createExplorerLink = ({
  chainId,
  txHash,
  chainType,
}: {
  chainId?: string;
  chainType?: string;
  txHash: string;
}) => {
  if (!chainType || !chainId) return undefined;
  switch (chainType) {
    case ChainType.Cosmos: {
      const chain = explorers.find((chain) => chain.chainId === chainId);
      const mintscan = chain?.explorers?.find((explorer) => explorer.kind === "mintscan");
      const explorer = mintscan || chain?.explorers?.[0];
      const url = explorer?.tx_page?.replace("${txHash}", txHash);
      return url;
    }
    case ChainType.Evm: {
      const chain = config.chains.find((chain) => chain.id === Number(chainId));
      const url = chain?.blockExplorers?.default.url;
      return url ? `${url}/tx/${txHash}` : undefined;
    }
    case ChainType.Svm: {
      return `https://solscan.io/tx/${txHash}`;
    }
    default:
      return undefined;
  }
};

export const createSkipExplorerLink = (transactionDetails?: TransactionDetails[]) => {
  if (!transactionDetails) return "";
  const { get } = jotaiStore;

  const txHashCommaSeperatedList = transactionDetails
    ?.map((txDetails) => txDetails.txHash)
    ?.join(",");

  const isTestnet = get(onlyTestnetsAtom);
  const initialTxChainId = transactionDetails?.[0]?.chainId;

  return `https://explorer.skip.build/?tx_hash=${txHashCommaSeperatedList}&chain_id=${initialTxChainId}${isTestnet ? "&is_testnet=true" : ""}`;
};
