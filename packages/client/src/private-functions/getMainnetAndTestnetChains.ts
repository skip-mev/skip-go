import { chains } from "../api/getChains";
import { ClientState } from "../state";

export const getMainnetAndTestnetChains = async () => {
  const [mainnetRes, testnetRes] = await Promise.all([
    chains({
      includeEvm: true,
      includeSvm: true,
      allowDuplicateRequests: true,
    }),
    chains({
      includeEvm: true,
      includeSvm: true,
      onlyTestnets: true,
      allowDuplicateRequests: true,
    }),
  ]);

  const combinedChains = [...(mainnetRes ?? []), ...(testnetRes ?? [])];
  ClientState.skipChains = combinedChains;

  return combinedChains;
};
