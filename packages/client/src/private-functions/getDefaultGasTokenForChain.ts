import { chains } from "src/chains";
import { DEFAULT_GAS_DENOM_OVERRIDES } from "src/constants/constants";

export const getDefaultGasTokenForChain = async (chainId: string) => {
  const gasDenom = DEFAULT_GAS_DENOM_OVERRIDES[chainId];
  if (gasDenom) {
    return gasDenom;
  }

  const chain = chains().find((chain) => chain.chainId === chainId);
  if (!chain) {
    return undefined;
  }

  if (!chain.fees) {
    return undefined;
  }

  // first check if the chain has a staking token, this is often the "default" gas token
  const stakingTokens = getStakingTokensForChain(chainId);

  if (stakingTokens && stakingTokens.length > 0) {
    const feeAsset = chain.fees.feeTokens.find(
      (feeToken) => feeToken.denom === stakingTokens[0]?.denom,
    );

    if (feeAsset) {
      return feeAsset.denom;
    }
  }

  // next attempt to get the first non-IBC asset in the fee_tokens array, at least this token will be native to the chain
  const nonIBCAsset = chain.fees.feeTokens.find(
    (token) => !token.denom.startsWith("ibc/") && !token.denom.startsWith("l2/"),
  );
  if (nonIBCAsset) {
    return nonIBCAsset.denom;
  }

  const nonL2Asset = chain.fees.feeTokens.find((token) => !token.denom.startsWith("l2/"));
  if (nonL2Asset) {
    return nonL2Asset.denom;
  }

  // if all else fails, just return the first token in the array
  return chain.fees.feeTokens[0]?.denom;
};

const getStakingTokensForChain = (chainId: string) => {
  const chain = chains().find((chain) => chain.chainId === chainId);
  if (!chain) {
    throw new Error(
      `getStakingTokensForChain error: failed to find chain id '${chainId}' in registry`,
    );
  }

  if (!chain.staking) {
    return undefined;
  }

  return chain.staking.stakingTokens;
};
