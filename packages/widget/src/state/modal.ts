import { atomWithReset } from "jotai/utils";

export const numberOfModalsOpenAtom = atomWithReset<number>(0);
