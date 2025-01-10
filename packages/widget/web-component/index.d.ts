/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare const WEB_COMPONENT_NAME = "skip-widget";

declare global {
  interface HTMLElementTagNameMap {
    [WEB_COMPONENT_NAME]: HTMLElement;
  }
}

export {};
