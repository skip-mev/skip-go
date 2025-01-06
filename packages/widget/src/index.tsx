export { Widget, ShowWidget } from "./widget/Widget";
export type { WidgetProps } from "./widget/Widget";
export { defaultTheme, lightTheme } from "./widget/theme";

import {
  init,
  replayIntegration,
  getReplay,
} from "@sentry/react";

init({
  dsn: "https://10ce608bdd1c68a13d3849d6b242333c@o4504768725909504.ingest.us.sentry.io/4508485201231872",
  integrations: [replayIntegration({
    maskAllText: false,
    maskAllInputs: false,
    blockAllMedia: false,
  })],
  // Tracing
  tracesSampleRate: 0,
  // Session Replay
  replaysSessionSampleRate: 0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const replay = getReplay();
replay?.startBuffering();