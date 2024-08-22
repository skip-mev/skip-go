import { atomWithReset } from "jotai/utils";

export const errorAtom = atomWithReset<
  ExpectedErrorDetails | Error | undefined
>(undefined);

type ExpectedErrorDetails = object;
