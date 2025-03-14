/* eslint-disable @typescript-eslint/no-empty-function */
global.window.matchMedia =
  global.window.matchMedia ||
  (() => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  });
