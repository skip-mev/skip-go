import { setApiOptions } from '@skip-go/client';
import { defaultSkipClientConfig } from '@/state/skipClient';

export const SKIP_API_URL = 'https://api.skip-dev.cosmoslabs.kr';

setApiOptions({ apiUrl: SKIP_API_URL });
