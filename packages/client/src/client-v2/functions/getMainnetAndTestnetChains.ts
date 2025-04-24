import { chains } from "../api/getChains";
import { ClientState } from "../state";

export const getMainnetAndTestnetChains = async () => {
  const [mainnetRes, testnetRes] = await Promise.all([
    chains({
      includeEvm: true,
      includeSvm: true,
    }).request(),
    chains({
      includeEvm: true,
      includeSvm: true,
      onlyTestnets: true,
    }).request(),
  ]);

  const combinedChains = [...(mainnetRes.chains ?? []), ...(testnetRes.chains ?? [])];
  ClientState.skipChains = combinedChains;

  return combinedChains;
};
