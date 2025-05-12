import { SkipApiOptions } from "src/state/apiState";
import { chains } from "../api/getChains";
import { ClientState } from "../state/clientState";

export const getMainnetAndTestnetChains = async (apiOptions?: SkipApiOptions) => {
  const [mainnetRes, testnetRes] = await Promise.all([
    chains({
      includeEvm: true,
      includeSvm: true,
      ...apiOptions,
    }),
    chains({
      includeEvm: true,
      includeSvm: true,
      onlyTestnets: true,
      ...apiOptions,
    }),
  ]);

  const combinedChains = [...(mainnetRes ?? []), ...(testnetRes ?? [])];
  ClientState.skipChains = combinedChains;

  return combinedChains;
};
