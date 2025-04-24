import { chains } from "../api/getChains";
import { ClientState } from "../state";

export const getMainnetAndTestnetChains = async () => {
  const [mainnetRes, testnetRes] = await Promise.all([
    chains.request({
      includeEvm: true,
      includeSvm: true,
    }),
    chains.request({
      includeEvm: true,
      includeSvm: true,
      onlyTestnets: true,
    }),
  ]);

  const combinedChains = [...(mainnetRes.chains ?? []), ...(testnetRes.chains ?? [])];
  ClientState.skipChains = combinedChains;

  return combinedChains;
};
