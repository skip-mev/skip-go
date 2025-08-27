export const isBrowser = typeof window !== "undefined" && typeof window.navigator !== "undefined";

export function isAndroid() {
  if (!isBrowser) {
    return false;
  }
  return isMobile() && window.navigator.userAgent.toLowerCase().includes("android");
}

export function isIos() {
  if (!isBrowser) {
    return false;
  }
  return isMobile() && window.navigator.userAgent.toLowerCase().match(/iphone|ipad/u);
}

export function isMobile() {
  if (!isBrowser) {
    return false;
  }
  return (
    window.matchMedia("(pointer:coarse)").matches ||
    !!window.navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u)
  );
}

export function isWindows() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).userAgentData?.platform.startsWith("Win") ??
    navigator.platform.startsWith("Win")
  );
}

export function isMac() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).userAgentData?.platform.startsWith("macOS") ??
    navigator.platform.startsWith("macOS")
  );
}
