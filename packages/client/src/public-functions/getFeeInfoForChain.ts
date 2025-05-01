import { chains } from "src/chains";
import { getDefaultGasTokenForChain } from "../private-functions/getDefaultGasTokenForChain";
import { getMainnetAndTestnetChains } from "../private-functions/getMainnetAndTestnetChains";
import { ClientState } from "src/state";

export const getFeeInfoForChain = async (chainId: string) => {
  const skipChains = await ClientState.getSkipChains();

  const skipChain = skipChains.find((chain) => chain.chainId === chainId);

  console.log(skipChain);

  if (!skipChain) {
    return undefined;
  }

  const defaultGasToken = await getDefaultGasTokenForChain(chainId);

  console.log(defaultGasToken);

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

  const chain = chains().find((chain) => chain.chain_id === chainId);
  if (!chain) {
    return undefined;
  }

  if (!chain.fees) {
    return undefined;
  }

  const registryFeeInfo = chain.fees.fee_tokens.find(
    (feeToken) => feeToken.denom === defaultGasToken,
  );

  if (!registryFeeInfo) {
    return undefined;
  }

  return {
    denom: registryFeeInfo.denom,
    gasPrice: {
      low: registryFeeInfo.low_gas_price ? `${registryFeeInfo.low_gas_price}` : "",
      average: registryFeeInfo.average_gas_price ? `${registryFeeInfo.average_gas_price}` : "",
      high: registryFeeInfo.high_gas_price ? `${registryFeeInfo.high_gas_price}` : "",
    },
  };
};
