import {
  convertHumanReadableAmountToCryptoAmount,
  convertTokenAmountToHumanReadableAmount,
} from "@/utils/crypto";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { EVM_GAS_AMOUNT, sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useGetSourceBalance } from "@/hooks/useGetSourceBalance";
import { BigNumber } from "bignumber.js";
import {
  useCosmosFeeAssetSourceAmountValidation,
  useCosmosFeeAssetsBalanceValidation,
} from "@/hooks/useCosmosFeeAssetValidation";
import { ChainType } from "@skip-go/client";
import {
  mainnet,
  polygon,
  avalanche,
  celo,
  arbitrum,
  arbitrumSepolia,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  forma,
  kava,
  kavaTestnet,
  linea,
  lineaSepolia,
  manta,
  mantaSepoliaTestnet,
  moonbeam,
  optimism,
  optimismSepolia,
  polygonMumbai,
  sei,
  sepolia,
} from "viem/chains";
import { formaTestnet } from "@/constants/wagmi";
import { createPublicClient, fallback, http } from "viem";
import { useCallback, useEffect, useState } from "react";

export const chainMap = {
  // 🌐 Mainnets
  "1": mainnet,
  "10": optimism,
  "56": bsc,
  "97": bscTestnet,
  "137": polygon,
  "169": manta,
  "250": fantom,
  "314": filecoin,
  "8453": base,
  "2222": kava,
  "42220": celo,
  "43114": avalanche,
  "59144": linea,
  "1284": moonbeam,
  "42161": arbitrum,
  "81457": blast,
  "4000": forma,
  "713715": sei,

  // 🧪 Testnets
  "80001": polygonMumbai,
  "11155111": sepolia,
  "43113": avalancheFuji,
  "84532": baseSepolia,
  "11155420": optimismSepolia,
  "421614": arbitrumSepolia,
  "168587773": blastSepolia,
  "4010": formaTestnet,
  "2221": kavaTestnet,
  "4002": fantomTestnet,
  "59141": lineaSepolia,
  "3441005": mantaSepoliaTestnet,
};

export const getEvmGasPriceEstimate = async (chainId?: string) => {
  if (!chainId) return;
  const chain = chainMap[chainId as keyof typeof chainMap];

  if (!chain) return null;

  const client = createPublicClient({
    chain,
    transport: fallback([
      http("https://ethereum.publicnode.com"),
      http("https://rpc.ankr.com/eth"),
      http("https://cloudflare-eth.com"),
    ]),
  });

  const fees = await client.estimateFeesPerGas();

  return Number(fees.maxFeePerGas);
};
export const useGasFeeTokenAmount = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const [gasFeeTokenAmount, setGasFeeTokenAmount] = useState<number>(0);

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });

  const cosmosFees = useCosmosFeeAssetsBalanceValidation(sourceAsset?.chainID);
  const cosmosFeeUsed = cosmosFees?.find((fee) => fee?.isSufficient);
  const chainType = sourceDetails?.chain?.chainType;

  const getGasFeeTokenAmount = useCallback(async (): Promise<number> => {
    switch (chainType) {
      case ChainType.EVM: {
        const result = await getEvmGasPriceEstimate(sourceAsset?.chainID ?? "");

        if (!result) {
          return Number(
            convertHumanReadableAmountToCryptoAmount(0.0008, sourceDetails.asset?.decimals),
          );
        }
        const gasFee = BigNumber(EVM_GAS_AMOUNT).multipliedBy(result);
        return Number(gasFee.toFixed(0));
      }
      case ChainType.Cosmos:
        return Number(cosmosFeeUsed?.feeAmount);
      case ChainType.SVM:
      default:
        return 0;
    }
  }, [chainType, cosmosFeeUsed?.feeAmount, sourceAsset?.chainID, sourceDetails.asset?.decimals]);

  useEffect(() => {
    const updateGasFeeTokenAmount = async () => {
      const fee = await getGasFeeTokenAmount();
      setGasFeeTokenAmount(fee);
    };

    updateGasFeeTokenAmount();
  }, [getGasFeeTokenAmount, sourceAsset?.chainID]);

  return gasFeeTokenAmount;
};

export const useMaxAmountTokenMinusFees = () => {
  const { data: sourceBalance } = useGetSourceBalance();
  const gasFeeTokenAmount = useGasFeeTokenAmount();
  const maxTokenAmount = sourceBalance?.amount;

  if (gasFeeTokenAmount && maxTokenAmount) {
    const maxTokenAmountMinusGasFees = BigNumber(maxTokenAmount)
      .minus(gasFeeTokenAmount)
      .toString();
    const maxAmountMinusGasFees = convertTokenAmountToHumanReadableAmount(
      maxTokenAmountMinusGasFees,
      sourceBalance?.decimals,
    );

    if (Number(maxAmountMinusGasFees) > 0) {
      return maxAmountMinusGasFees;
    } else {
      return "0";
    }
  }
  return (
    maxTokenAmount &&
    convertTokenAmountToHumanReadableAmount(String(maxTokenAmount), sourceBalance?.decimals)
  );
};

export const useSetMaxAmount = () => {
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);

  return () => {
    if (maxAmountTokenMinusFees) {
      setSourceAssetAmount(maxAmountTokenMinusFees);
    }
  };
};

export const useInsufficientSourceBalance = () => {
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);
  const cosmosFeeAssetValidation = useCosmosFeeAssetSourceAmountValidation();

  if (!sourceAsset?.amount) return false;
  if (!maxAmountTokenMinusFees) return true;

  const chain = chains?.find((chain) => chain.chainID === sourceAsset?.chainID);
  if (chain?.chainType === ChainType.Cosmos) {
    return cosmosFeeAssetValidation;
  }

  if (BigNumber(maxAmountTokenMinusFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))) {
    return false;
  }
  return true;
};
