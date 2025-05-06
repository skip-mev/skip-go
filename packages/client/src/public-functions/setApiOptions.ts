import { Fetch, SkipApiOptions } from "src/utils/fetchClient";
import { createRequestClient } from "../utils/generateApi";

export const setApiOptions = (options: SkipApiOptions = {}) => {
  Fetch.client = createRequestClient({
    baseUrl: options.apiUrl || "https://api.skip.build",
    apiKey: options.apiKey,
  });

  Fetch.setClientInitialized();

  return Fetch.clientInitialized;
};
