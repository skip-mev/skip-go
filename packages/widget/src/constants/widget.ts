import { RoutePreference } from "@/state/swapPage";

export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1, 3];
export const DEFAULT_SLIPPAGE = 1;

export const ROUTE_PREFERENCE_OPTIONS: RoutePreference[] = [
  RoutePreference.FASTEST,
  RoutePreference.CHEAPEST,
];
export const DEFAULT_DECIMAL_PLACES = 6;

export enum CosmosGasAmount {
  DEFAULT = 300_000,
  SWAP = 2_800_000,
  CARBON = 1_000_000,
}

