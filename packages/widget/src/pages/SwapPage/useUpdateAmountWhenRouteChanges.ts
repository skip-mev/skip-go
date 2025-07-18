import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { swapDirectionAtom, sourceAssetAtom, destinationAssetAtom } from "@/state/swapPage";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { skipRouteAtom, skipRouteReducedByGasAtom } from "@/state/route";
import { removeTrailingZeros } from "@/utils/number";

export const useUpdateAmountWhenRouteChanges = () => {
  const originalRoute = useAtomValue(skipRouteAtom);
  const routeReducedByGasRoute = useAtomValue(skipRouteReducedByGasAtom);
  const direction = useAtomValue(swapDirectionAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);

  const route = routeReducedByGasRoute.data ? routeReducedByGasRoute : originalRoute;
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

    // if (gasRoute.data) {
    //   console.log("Gas route data changed", gasRoute.data);
    //   if (gasRoute.data === prevGasRoute.current) return;
    //   prevGasRoute.current = gasRoute.data;
    //   console.log("Gas route changed, updating amounts");

    //   const mainRouteAmountReducedByGasRoute = BigNumber(route.data.amountIn).minus(
    //     gasRoute.data.amountIn,
    //   );
    //   console.log(
    //     "Main route amount reduced by gas route:",
    //     mainRouteAmountReducedByGasRoute.toString(),
    //   );
    //   setSourceAsset((old) => ({
    //     ...old,
    //     amount: removeTrailingZeros(
    //       convertTokenAmountToHumanReadableAmount(
    //         mainRouteAmountReducedByGasRoute.toString(),
    //         sourceAsset.decimals,
    //       ),
    //     ),
    //   }));
    // }
  }, [route.data, direction, sourceAsset, destinationAsset, setSourceAsset, setDestinationAsset]);
};
