import { init } from "@amplitude/analytics-browser";
import { version } from "../../package.json";

let isAmplitudeInitialized = false;

export const initAmplitude = () => {
  if (isAmplitudeInitialized) return;
  init("14616a575f32087cf0403ab8f3ea3ce0", { autocapture: true, appVersion: version });
  isAmplitudeInitialized = true;
};
