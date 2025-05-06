import { createRequestClient } from "./generateApi";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Fetch {
  static client: ReturnType<typeof createRequestClient>;

  static isInitialized = false;
  static resolveInitialization: () => void;
  static clientInitialized: Promise<void> = new Promise<void>((resolve) => {
    Fetch.resolveInitialization = () => {
      if (!Fetch.isInitialized) {
        Fetch.isInitialized = true;
        resolve();
      }
    };
  });

  static setClientInitialized() {
    Fetch.resolveInitialization();
  }
}

export type SkipApiOptions = {
  apiUrl?: string;
  apiKey?: string;
};
