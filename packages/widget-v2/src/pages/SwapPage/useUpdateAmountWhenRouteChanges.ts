import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  swapDirectionAtom,
  sourceAssetAtom,
  destinationAssetAtom,
} from "@/state/swapPage";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { limitDecimalsDisplayed } from "@/utils/number";
import { skipRouteAtom } from "@/state/route";

export const useUpdateAmountWhenRouteChanges = () => {
  const [route] = useAtom(skipRouteAtom);
  const [direction] = useAtom(swapDirectionAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);

  useEffect(() => {
    if (!route.data || !sourceAsset || !destinationAsset) return;

    const swapInAmount = convertTokenAmountToHumanReadableAmount(
      route.data.amountOut,
      destinationAsset.decimals
    );
    const swapOutAmount = convertTokenAmountToHumanReadableAmount(
      route.data.amountIn,
      sourceAsset.decimals
    );

    const swapInAmountChanged = swapInAmount !== destinationAsset.amount;
    const swapOutAmountChanged = swapOutAmount !== sourceAsset.amount;

    if (direction === "swap-in" && swapInAmountChanged) {
      setDestinationAsset((old) => ({
        ...old,
        amount: limitDecimalsDisplayed(swapInAmount),
      }));
    } else if (direction === "swap-out" && swapOutAmountChanged) {
      setSourceAsset((old) => ({
        ...old,
        amount: limitDecimalsDisplayed(swapOutAmount),
      }));
    }
  }, [route.data, sourceAsset, destinationAsset, direction, setSourceAsset, setDestinationAsset]);

};