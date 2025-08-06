import type { ChainAffiliates } from "src/types/swaggerTypes";
import { createRequestClient } from "../utils/generateApi";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ApiState {
  static client: ReturnType<typeof createRequestClient>;

  static chainIdsToAffiliates?: Record<string, ChainAffiliates>;
  static cumulativeAffiliateFeeBPS?: string = "0";

  static initialized = false;
  static apiCalled = false;

}

export type SkipApiOptions = {
  apiUrl?: string;
  apiKey?: string;
  apiHeaders?: HeadersInit;
  allowOptionsUpdateAfterApiCall?: boolean;
};
