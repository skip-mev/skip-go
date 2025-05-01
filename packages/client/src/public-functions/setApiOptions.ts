import { ClientState, SkipApiOptions } from "../state";
import { createRequestClient } from "../utils/generateApi";

export const setApiOptions = (options: SkipApiOptions = {}) => {
  ClientState.requestClient = createRequestClient({
    baseUrl: options.apiUrl || "https://api.skip.build",
    apiKey: options.apiKey,
  });

  ClientState.setClientInitialized();
};
