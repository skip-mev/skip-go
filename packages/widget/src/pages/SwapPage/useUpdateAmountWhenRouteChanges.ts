import { useEffect } from "react";
import { useAtom } from "jotai";
import { swapDirectionAtom, sourceAssetAtom, destinationAssetAtom } from "@/state/swapPage";
import { convertTokenAmountToHumanReadableAmount, hasAmountChanged } from "@/utils/crypto";
import { limitDecimalsDisplayed, removeTrailingZeros } from "@/utils/number";
import { skipRouteAtom } from "@/state/route";
import { DEFAULT_DECIMAL_PLACES } from "@/constants/widget";

export const useUpdateAmountWhenRouteChanges = () => {
  const [route] = useAtom(skipRouteAtom);
  const [direction] = useAtom(swapDirectionAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);

  useEffect(() => {
    if (!route.data || !sourceAsset || !destinationAsset) return;
    if (sourceAsset?.amount === "" && direction === "swap-in") return;
    if (destinationAsset?.amount === "" && direction === "swap-out") return;

    const swapInAmount = convertTokenAmountToHumanReadableAmount(
      route.data.amountOut,
      destinationAsset.decimals,
    );
    const swapOutAmount = convertTokenAmountToHumanReadableAmount(
      route.data.amountIn,
      sourceAsset.decimals,
    );

    const swapInAmountChanged = hasAmountChanged(
      swapInAmount,
      destinationAsset?.amount ?? "",
      DEFAULT_DECIMAL_PLACES,
    );
    const swapOutAmountChanged = hasAmountChanged(
      swapOutAmount,
      sourceAsset?.amount ?? "",
      DEFAULT_DECIMAL_PLACES,
    );

    if (direction === "swap-in" && swapInAmountChanged) {
      setDestinationAsset((old) => ({
        ...old,
        amount: removeTrailingZeros(limitDecimalsDisplayed(swapInAmount)),
      }));
    } else if (direction === "swap-out" && swapOutAmountChanged) {
      setSourceAsset((old) => ({
        ...old,
        amount: removeTrailingZeros(limitDecimalsDisplayed(swapOutAmount)),
      }));
    }
  }, [route.data, sourceAsset, destinationAsset, direction, setSourceAsset, setDestinationAsset]);
};
