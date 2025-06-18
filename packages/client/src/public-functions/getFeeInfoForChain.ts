import { chains } from "src/chains";
import { getDefaultGasTokenForChain } from "../private-functions/getDefaultGasTokenForChain";
import { ClientState } from "src/state/clientState";
import type { SkipApiOptions } from "src/state/apiState";

export type GetFeeInfoForChainProps = {
  chainId: string;
} & SkipApiOptions;

export const getFeeInfoForChain = async ({ chainId, apiUrl, apiKey }: GetFeeInfoForChainProps) => {
  const skipChains = await ClientState.getSkipChains({ apiUrl, apiKey });

  const skipChain = skipChains.find((chain) => chain.chainId === chainId);

  if (!skipChain) {
    return undefined;
  }

  const defaultGasToken = await getDefaultGasTokenForChain(chainId);

  if (!defaultGasToken && !skipChain.feeAssets) {
    return undefined;
  }

  const skipFeeInfo = defaultGasToken
    ? skipChain.feeAssets?.find((skipFee) => skipFee.denom === defaultGasToken)
    : skipChain.feeAssets?.[0];

  if (!skipFeeInfo && skipChain.feeAssets?.[0]?.gasPrice !== null) {
    return skipChain.feeAssets?.[0];
  }
  if (skipFeeInfo && skipFeeInfo.gasPrice !== null) {
    return skipFeeInfo;
  }

  const chain = chains().find((chain) => chain.chainId === chainId);
  if (!chain) {
    return undefined;
  }

  if (!chain.fees) {
    return undefined;
  }

  const registryFeeInfo = chain.fees.feeTokens.find(
    (feeToken) => feeToken.denom === defaultGasToken,
  );

  if (!registryFeeInfo) {
    return undefined;
  }

  return {
    denom: registryFeeInfo.denom,
    gasPrice: {
      low: registryFeeInfo.lowGasPrice ? `${registryFeeInfo.lowGasPrice}` : "",
      average: registryFeeInfo.averageGasPrice ? `${registryFeeInfo.averageGasPrice}` : "",
      high: registryFeeInfo.highGasPrice ? `${registryFeeInfo.highGasPrice}` : "",
    },
  };
};
