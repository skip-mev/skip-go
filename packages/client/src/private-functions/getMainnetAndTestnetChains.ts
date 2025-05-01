import { chainsAllowDuplicates } from "../api/getChains";
import { ClientState } from "../state";

export const getMainnetAndTestnetChains = async () => {
  const [mainnetRes, testnetRes] = await Promise.all([
    chainsAllowDuplicates({
      includeEvm: true,
      includeSvm: true,
    }),
    chainsAllowDuplicates({
      includeEvm: true,
      includeSvm: true,
      onlyTestnets: true,
    }),
  ]);

  const combinedChains = [...(mainnetRes ?? []), ...(testnetRes ?? [])];
  ClientState.skipChains = combinedChains;

  return combinedChains;
};
