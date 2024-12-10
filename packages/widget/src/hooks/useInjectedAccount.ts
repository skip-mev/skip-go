import { useAtomValue } from "jotai";
import { getSignersAtom } from "@/state/wallets";
import { useQuery } from "@tanstack/react-query";
import { skipChainsAtom } from "@/state/skipClient";
import { ChainType } from "@skip-go/client";

export const useInjectedAccount = (chainId?: string) => {
  const getSigners = useAtomValue(getSignersAtom)
  const { data: chains } = useAtomValue(skipChainsAtom)
  const chainType = chains?.find((chain) => chain.chainID === chainId)?.chainType

  const query = useQuery({
    queryKey: ["injected-account", { chainId, chainType }],
    queryFn: async () => {
      if (!chainId) return null
      switch (chainType) {
        case ChainType.Cosmos:
          const signer = await getSigners?.getCosmosSigner?.(chainId)
          if (!signer) return null
          const account = (await signer.getAccounts())[0]
          if (!account) return null
          return {
            address: account.address,
            chainType,
            wallet: {
              name: 'injected',
              prettyName: "Injected",
              logo: undefined,
            },
          };
        case ChainType.EVM:
          const evmSigner = await getSigners?.getEVMSigner?.(chainId)
          if (!evmSigner) return null
          const evmAccount = evmSigner.account
          if (!evmAccount) return null
          return {
            address: evmAccount.address,
            chainType,
            wallet: {
              name: 'injected',
              prettyName: "Injected",
              logo: undefined,
            },
          };
        case ChainType.SVM:
          const svmSigner = await getSigners?.getSVMSigner?.()
          if (!svmSigner) return null
          const svmAddress = svmSigner.publicKey?.toBase58()
          if (!svmAddress) return null
          return {
            address: svmAddress,
            chainType,
            wallet: {
              name: 'injected',
              prettyName: "Injected",
              logo: undefined,
            },
          };
        default:
          return null
      }
    }
  })

  return query
}
