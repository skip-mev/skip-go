import { RoutePreference } from "@/state/swapPage";

export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1, 3];

export const ROUTE_PREFERENCE_OPTIONS: RoutePreference[] = [
  RoutePreference.FASTEST,
  RoutePreference.CHEAPEST,
];
export const DEFAULT_DECIMAL_PLACES = 6;

export const DEFAULT_COSMOS_GAS_AMOUNT = 200_000;

export const SWAP_COSMOS_GAS_AMOUNT = 2_000_000;
