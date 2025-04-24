import { atom } from "jotai";

const PRIVILEGED_ASSETS = ["ATOM", "USDC", "USDT", "ETH", "TIA", "OSMO", "NTRN", "INJ"];

export const assetSymbolsSortedToTopAtom = atom<string[]>(PRIVILEGED_ASSETS);
