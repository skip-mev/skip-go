export { Widget, ShowWidget } from "./widget/Widget";
export type { WidgetProps } from "./widget/Widget";
export { defaultTheme, lightTheme } from "./widget/theme";

import {
  init,
  browserTracingIntegration,
  replayIntegration,
} from "@sentry/react";

init({
  dsn: "https://10ce608bdd1c68a13d3849d6b242333c@o4504768725909504.ingest.us.sentry.io/4508485201231872",
  integrations: [browserTracingIntegration(), replayIntegration({
    maskAllText: false,
    maskAllInputs: false,
    blockAllMedia: false,
  })],
  // Tracing
  tracesSampleRate: 1,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https?:\/\/go\.skip\.build/,
    /.*skip-protocol\.vercel\.app$/,
  ],
  // Session Replay
  replaysSessionSampleRate: 1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
