const isBrowser = typeof window !== "undefined" && typeof window.navigator !== "undefined";

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
