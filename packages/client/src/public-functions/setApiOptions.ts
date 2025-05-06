import { Fetch, SkipApiOptions } from "src/utils/fetchClient";
import { createRequestClient } from "../utils/generateApi";

export const setApiOptions = (options: SkipApiOptions = {}) => {
  const client = createRequestClient({
    baseUrl: options.apiUrl || "https://api.skip.build",
    apiKey: options.apiKey,
  });

  Fetch.setClient(client);
  Fetch.setClientInitialized();

  return Fetch.clientInitialized;
};
