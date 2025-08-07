import { init, add } from "@amplitude/analytics-browser";
import { version } from "../../package.json";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

let isAmplitudeInitialized = false;

const serverUrl = "https://go.skip.build/api/amplitude";

export const initAmplitude = () => {
  if (isAmplitudeInitialized) return;

  init("14616a575f32087cf0403ab8f3ea3ce0", {
    appVersion: version,
    serverUrl: `${serverUrl}/httpapi`,
  });

  isAmplitudeInitialized = true;
};

export const startAmplitudeSessionReplay = () => {
  if (isAmplitudeInitialized) {
    const plugin = sessionReplayPlugin({
      sampleRate: 1,
      trackServerUrl: `${serverUrl}/upload`,
      configServerUrl: `${serverUrl}/config`,
    });
    add(plugin);
  }
};
