import { createRequestClient } from "./generateApi";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Fetch {
  static client: ReturnType<typeof createRequestClient>;

  private static isInitialized = false;
  private static resolveInitialization: () => void;
  static clientInitialized: Promise<void> = new Promise<void>((resolve) => {
    this.resolveInitialization = () => {
      if (!this.isInitialized) {
        this.isInitialized = true;
        resolve();
      }
    };
  });

  static setClientInitialized() {
    this.resolveInitialization();
  }
}

export type SkipApiOptions = {
  apiUrl?: string;
  apiKey?: string;
};
