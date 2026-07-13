import { atom } from "jotai";
import { skipExplorerUrl } from "@/constants/skipClientDefault";

export const skipExplorerUrlAtom = atom<string>(skipExplorerUrl);
