import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { swapDirectionAtom, sourceAssetAtom, destinationAssetAtom } from "@/state/swapPage";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { skipRouteAtom } from "@/state/route";
import { removeTrailingZeros } from "@/utils/number";

export const useUpdateAmountWhenRouteChanges = () => {
  const route = useAtomValue(skipRouteAtom);
  const direction = useAtomValue(swapDirectionAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);

  const prevRoute = useRef(route.data);

  useEffect(() => {
    if (!route.data || !sourceAsset || !destinationAsset) return;

    if (route.data === prevRoute.current) return;
    prevRoute.current = route.data;

    if (sourceAsset.amount === "" && direction === "swap-in") return;
    if (destinationAsset.amount === "" && direction === "swap-out") return;

    const swapInAmount = convertTokenAmountToHumanReadableAmount(
      route.data.amountOut,
      destinationAsset.decimals,
    );
    const swapOutAmount = convertTokenAmountToHumanReadableAmount(
      route.data.amountIn,
      sourceAsset.decimals,
    );

    if (direction === "swap-in") {
      setDestinationAsset((old) => ({
        ...old,
        amount: removeTrailingZeros(swapInAmount),
      }));
    } else if (direction === "swap-out") {
      setSourceAsset((old) => ({
        ...old,
        amount: removeTrailingZeros(swapOutAmount),
      }));
    }
  }, [route.data, direction, sourceAsset, destinationAsset, setSourceAsset, setDestinationAsset]);
};
