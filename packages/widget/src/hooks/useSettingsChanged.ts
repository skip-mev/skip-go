import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { swapSettingsAtom, defaultSwapSettings } from "@/state/swapPage";

export const useSettingsChanged = () => {
  const swapSettings = useAtomValue(swapSettingsAtom);

  return useMemo(
    () =>
      swapSettings.slippage !== defaultSwapSettings.slippage ||
      swapSettings.routePreference !== defaultSwapSettings.routePreference,
    [swapSettings]
  );
};
