import {
  cleanupDebouncedDestinationAssetAmountAtom,
  cleanupDebouncedSourceAssetAmountAtom,
} from "@/state/swapPage";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useCleanupDebouncedAtoms = () => {
  const cleanupDebouncedSourceAssetAmount = useSetAtom(
    cleanupDebouncedSourceAssetAmountAtom
  );
  const cleanupDebouncedDestinationAssetAmount = useSetAtom(
    cleanupDebouncedDestinationAssetAmountAtom
  );

  useEffect(() => {
    return () => {
      cleanupDebouncedSourceAssetAmount(undefined);
      cleanupDebouncedDestinationAssetAmount(undefined);
    };
  }, [
    cleanupDebouncedDestinationAssetAmount,
    cleanupDebouncedSourceAssetAmount,
  ]);
};
