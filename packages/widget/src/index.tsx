export { Widget, ShowWidget } from "./widget/Widget";
export type { WidgetProps } from "./widget/Widget";
export { defaultTheme, lightTheme } from "./widget/theme";

import {
  init,
  replayIntegration,
} from "@sentry/react";

init({
  dsn: "https://10ce608bdd1c68a13d3849d6b242333c@o4504768725909504.ingest.us.sentry.io/4508485201231872",
  integrations: [replayIntegration({
    maskAllText: false,
    maskAllInputs: false,
    blockAllMedia: false,
  })],
  // Session Replay
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1,
});
