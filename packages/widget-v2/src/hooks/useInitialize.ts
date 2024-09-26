import { sourceAssetAtom, debouncedSourceAssetAmountAtom, debouncedDestinationAssetAmountAtom, swapDirectionAtom, destinationAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

export const useInitialize = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const destinationAsset = useAtomValue(destinationAssetAtom);
  const direction = useAtomValue(swapDirectionAtom);

  const [debouncedSourceAmount, setDebouncedSourceAssetAmount] = useAtom(debouncedSourceAssetAmountAtom);
  const [debouncedDestinationAmount, setDebouncedDestinationAmount] = useAtom(debouncedDestinationAssetAmountAtom);
  useEffect(() => {
    if (direction === "swap-in" && debouncedSourceAmount === undefined && sourceAsset?.amount) {
      setDebouncedSourceAssetAmount(sourceAsset?.amount);
    } else if (direction === "swap-out" && debouncedDestinationAmount === undefined && destinationAsset?.amount) {
      setDebouncedDestinationAmount(destinationAsset?.amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};