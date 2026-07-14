import { setApiOptions } from "@skip-go/client";
import { defaultSkipClientConfig } from "@/state/skipClient";

export const SKIP_API_URL =
  process.env.NEXT_PUBLIC_API_URL || defaultSkipClientConfig.apiUrl;

setApiOptions({ apiUrl: SKIP_API_URL });
