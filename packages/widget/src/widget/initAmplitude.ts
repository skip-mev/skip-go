import { init, add } from "@amplitude/analytics-browser";
import { version } from "../../package.json";
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

let isAmplitudeInitialized = false;

export const initAmplitude = () => {
  if (isAmplitudeInitialized) return;
  
  const plugin = sessionReplayPlugin();
  add(plugin);

  init("14616a575f32087cf0403ab8f3ea3ce0", {
    autocapture: true,
    appVersion: version,
  });

  isAmplitudeInitialized = true;
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         