import { bech32, bech32m } from "bech32";

// Create wrapped versions of bech32 and bech32m with default limits of 1023 characters
const wrappedBech32 = {
  ...bech32,
  decode: (str: string, LIMIT = 1023) => bech32.decode(str, LIMIT),
  decodeUnsafe: (str: string, LIMIT = 1023) => bech32.decodeUnsafe(str, LIMIT),
};

const wrappedBech32m = {
  ...bech32m,
  decode: (str: string, LIMIT = 1023) => bech32m.decode(str, LIMIT),
  decodeUnsafe: (str: string, LIMIT = 1023) => bech32m.decodeUnsafe(str, LIMIT),
};

export { wrappedBech32 as bech32, wrappedBech32m as bech32m };
