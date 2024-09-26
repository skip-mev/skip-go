import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue } from "jotai";
import { useGetAccount } from "./useGetAccount";

export const useSourceAccount = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  return getAccount(sourceAsset?.chainID);
};
