import { useAccount } from "@/hooks/useAccount";
import { skipBalancesAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue } from "jotai";

export const useSourceBalance = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const sourceAccount = useAccount(sourceAsset?.chainID);
  const { data: skipBalances } = useAtomValue(skipBalancesAtom);

  if (!sourceAsset || !sourceAccount || !skipBalances) return;
  const { chainID, denom } = sourceAsset;
  if (!denom || !chainID) return;

  return skipBalances?.chains?.[chainID]?.denoms?.[denom];
};
