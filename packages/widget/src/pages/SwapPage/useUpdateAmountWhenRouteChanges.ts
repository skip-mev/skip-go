import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { swapDirectionAtom, sourceAssetAtom, destinationAssetAtom } from "@/state/swapPage";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { skipRouteAtom } from "@/state/route";

export const useUpdateAmountWhenRouteChanges = () => {
  const [route] = useAtom(skipRouteAtom);
  const [direction] = useAtom(swapDirectionAtom);
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
        amount: swapInAmount,
      }));
    } else if (direction === "swap-out") {
      setSourceAsset((old) => ({
        ...old,
        amount: swapOutAmount,
      }));
    }
  }, [route.data, direction, sourceAsset, destinationAsset, setSourceAsset, setDestinationAsset]);
};
