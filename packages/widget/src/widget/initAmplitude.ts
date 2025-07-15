import { init, add } from "@amplitude/analytics-browser";
import { version } from "../../package.json";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

const isAmplitudeInitialized = false;

export const initAmplitude = () => {
  if (isAmplitudeInitialized) return;

  const serverUrl = "https://go.skip.build/api/amplitude";

  init("14616a575f32087cf0403ab8f3ea3ce0", {
    appVersion: version,
    serverUrl: `${serverUrl}/httpapi`,
  });

  const plugin = sessionReplayPlugin({
    sampleRate: 1,
    trackServerUrl: `${serverUrl}/upload`,
    configServerUrl: `${serverUrl}/config`,
  });
  add(plugin);
};
