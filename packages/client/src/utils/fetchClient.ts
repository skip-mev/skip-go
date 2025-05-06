import { createRequestClient } from "./generateApi";

let client: ReturnType<typeof createRequestClient> | undefined;
let isInitialized = false;
let resolveInit: () => void;
const clientInitialized = new Promise<void>((resolve) => {
  resolveInit = () => {
    if (!isInitialized) {
      isInitialized = true;
      resolve();
    }
  };
});

export const Fetch = {
  setClientInitialized() {
    resolveInit?.();
  },
  getClient() {
    if (!client) throw new Error("Fetch client not set");
    return client;
  },
  setClient(newClient: ReturnType<typeof createRequestClient>) {
    client = newClient;
  },
  isInitialized: () => isInitialized,
  clientInitialized,
};

export type SkipApiOptions = {
  apiUrl?: string;
  apiKey?: string;
};
