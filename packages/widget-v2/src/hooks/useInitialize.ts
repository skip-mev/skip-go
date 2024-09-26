import { sourceAssetAtom, debouncedSourceAssetAmountAtom, debouncedDestinationAssetAmountAtom, swapDirectionAtom, destinationAssetAtom, instantlyUpdateDebouncedSourceAssetAmountAtom, instantlyUpdateDebouncedDestinationAssetAmountAtom } from "@/state/swapPage";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const useInitialize = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const destinationAsset = useAtomValue(destinationAssetAtom);
  const direction = useAtomValue(swapDirectionAtom);

  const debouncedSourceAmount = useAtomValue(debouncedSourceAssetAmountAtom);
  const debouncedDestinationAmount = useAtomValue(debouncedDestinationAssetAmountAtom);

  const updateDebouncedSourceAssetAmount = useSetAtom(instantlyUpdateDebouncedSourceAssetAmountAtom);
  const updateDebouncedDestinationAssetAmount = useSetAtom(instantlyUpdateDebouncedDestinationAssetAmountAtom);

  useEffect(() => {
    if (direction === "swap-in" && debouncedSourceAmount === undefined && sourceAsset?.amount) {
      updateDebouncedSourceAssetAmount(sourceAsset?.amount);
    } else if (direction === "swap-out" && debouncedDestinationAmount === undefined && destinationAsset?.amount) {
      updateDebouncedDestinationAssetAmount(destinationAsset?.amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};