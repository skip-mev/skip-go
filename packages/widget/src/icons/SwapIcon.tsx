import { IconProps } from ".";

export const SwapIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="swapMask">
        <rect width="40" height="40" fill="white" />
        <path
          d="M22.959 27.9526H17.5572C16.3875 27.9526 15.8005 26.5389 16.6294 25.71L21.5607 20.7787L19.2281 18.446L14.2967 23.3774C13.4701 24.204 12.0542 23.6192 12.0542 22.4496V17.0411H8.75635V31.2482H22.959V27.9504V27.9526Z"
          fill="black"
        />
        <path
          d="M23.3702 14.2922L18.2146 19.4478L20.5472 21.7805L25.7028 16.6249C26.5295 15.7982 27.9454 16.383 27.9454 17.5526V22.9611H31.2432V8.75183H17.0405V12.0497H22.4424C23.612 12.0497 24.199 13.4633 23.3702 14.2922Z"
          fill="black"
        />
      </mask>
    </defs>
    <rect width="40" height="40" rx="10" fill={color} mask="url(#swapMask)" />
  </svg>
);
