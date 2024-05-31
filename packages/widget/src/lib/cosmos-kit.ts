import { wallets as cosmostation } from "@cosmos-kit/cosmostation-extension";
import { wallets as keplr } from "@cosmos-kit/keplr-extension";
import { wallets as leap } from "@cosmos-kit/leap-extension";
import { wallets as okxwallet } from "@cosmos-kit/okxwallet";
import { wallets as station } from "@cosmos-kit/station";
import { wallets as vectis } from "@cosmos-kit/vectis";

export const wallets = [...keplr, ...cosmostation, ...leap, ...okxwallet, ...station, ...vectis];
