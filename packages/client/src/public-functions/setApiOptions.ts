import { ApiState } from "src/state/apiState";
import type { SkipApiOptions } from "src/state/apiState";
import { createRequestClient } from "../utils/generateApi";
import type { Affiliate, ChainAffiliates } from "src/types/swaggerTypes";

export type SetApiOptionsProps = {
  chainIdsToAffiliates?: Record<string, ChainAffiliates>;
} & SkipApiOptions;

export const setApiOptions = (options: SetApiOptionsProps = {}) => {
  ApiState.client = createRequestClient({
    apiUrl: options.apiUrl || "https://api.skip.build",
    apiKey: options.apiKey,
    apiHeaders: options.apiHeaders,
  });

  ApiState.setClientInitialized();

  if (options.chainIdsToAffiliates) {
    ApiState.cumulativeAffiliateFeeBPS = validateChainIdsToAffiliates(options.chainIdsToAffiliates);
    ApiState.chainIdsToAffiliates = options.chainIdsToAffiliates;
  }

  return ApiState.clientInitialized;
};

function validateChainIdsToAffiliates(chainIdsToAffiliates: Record<string, ChainAffiliates>) {
  const affiliatesArray = Object.values(chainIdsToAffiliates)
    .map((chain) => chain.affiliates)
    .filter((a) => a !== undefined) as Affiliate[][];

  const firstAffiliateBasisPointsFee = affiliatesArray[0]?.reduce((acc, affiliate) => {
    if (!affiliate.basisPointsFee) {
      throw new Error("basisPointFee must exist in each affiliate");
    }
    return acc + parseInt(affiliate.basisPointsFee, 10);
  }, 0);

  const allBasisPointsAreEqual = affiliatesArray.every((affiliate) => {
    const totalBasisPointsFee = affiliate.reduce((acc, affiliate) => {
      if (!affiliate.basisPointsFee) {
        throw new Error("basisPointFee must exist in each affiliate");
      }
      if (!affiliate.address) {
        throw new Error("address to receive fee must exist in each affiliate");
      }
      return acc + parseInt(affiliate?.basisPointsFee, 10);
    }, 0);
    return totalBasisPointsFee === firstAffiliateBasisPointsFee;
  });

  if (!allBasisPointsAreEqual) {
    throw new Error(
      "basisPointFee does not add up to the same number for each chain in chainIdsToAffiliates",
    );
  }

  return firstAffiliateBasisPointsFee?.toFixed(0);
}
