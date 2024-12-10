import { RoutePreference } from "@/state/types";

export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1, 3];
export const DEFAULT_SLIPPAGE = 1;

export const ROUTE_PREFERENCE_OPTIONS: RoutePreference[] = [
  RoutePreference.FASTEST,
  RoutePreference.CHEAPEST,
];
export const DEFAULT_DECIMAL_PLACES = 6;
