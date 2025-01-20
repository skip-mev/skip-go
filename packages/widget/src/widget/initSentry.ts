import {
  breadcrumbsIntegration,
  browserSessionIntegration,
  dedupeIntegration,
  functionToStringIntegration,
  httpContextIntegration,
  inboundFiltersIntegration,
  init,
  linkedErrorsIntegration,
  replayIntegration,
} from "@sentry/react";

let isSentryInitialized = false;

export const initSentry = () => {
  if (isSentryInitialized) return;
  init({
    dsn: "https://10ce608bdd1c68a13d3849d6b242333c@o4504768725909504.ingest.us.sentry.io/4508485201231872",
    tunnel: "https://go.skip.build/api/sentry",
    defaultIntegrations: false,
    denyUrls: [/^https?:\/\/localhost:.*/],
    integrations: [
      breadcrumbsIntegration(),
      dedupeIntegration(),
      functionToStringIntegration(),
      httpContextIntegration(),
      inboundFiltersIntegration(),
      linkedErrorsIntegration(),
      browserSessionIntegration(),
      replayIntegration({
        maskAllText: false,
        maskAllInputs: false,
        blockAllMedia: false,
        networkDetailAllowUrls: [/^https:\/\/go\.skip\.build\//],
        networkRequestHeaders: ["X-Custom-Header"],
        networkResponseHeaders: ["X-Custom-Header"],
        beforeErrorSampling(event) {
          if (!event?.level || ["error", "fatal"].includes(event.level)) {
            return false;
          }
          return true;
        },
      }),
    ],
    // Session Replay
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
  });
  isSentryInitialized = true;
};
