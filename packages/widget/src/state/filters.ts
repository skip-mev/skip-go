import { atom } from "jotai";

export type ChainFilter = {
  source?: Record<string, string[] | undefined>;
  destination?: Record<string, string[] | undefined>;
};

export const filterAtom = atom<ChainFilter>();

export const filterOutAtom = atom<ChainFilter>();

export const filterOutUnlessUserHasBalanceAtom = atom<ChainFilter>();
