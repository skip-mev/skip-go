import type { ChainAffiliates } from "src/types/swaggerTypes";
import { createRequestClient } from "../utils/generateApi";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ApiState {
  static client: ReturnType<typeof createRequestClient>;

  static chainIdsToAffiliates?: Record<string, ChainAffiliates>;
  static cumulativeAffiliateFeeBPS?: string = "0";

  static isInitialized = false;
  static resolveInitialization: () => void;
  static clientInitialized: Promise<void> = new Promise<void>((resolve) => {
    ApiState.resolveInitialization = () => {
      if (!ApiState.isInitialized) {
        ApiState.isInitialized = true;
        resolve();
      }
    };
  });

  static setClientInitialized() {
    ApiState.resolveInitialization();
  }
}

export type SkipApiOptions = {
  apiUrl?: string;
  apiKey?: string;
  apiHeaders?: HeadersInit;
};
