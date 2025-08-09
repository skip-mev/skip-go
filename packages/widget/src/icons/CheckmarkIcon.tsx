import { IconProps } from ".";

export const CheckmarkIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="checkmarkMask">
        <rect width="40" height="40" fill="white" />
        <path
          d="M13.4052 17.915L11.8286 16.3384L8.58887 19.5182L17.5889 28.5164L19.7233 26.3819C19.725 26.3802 19.7267 26.3786 19.7283 26.377L31.4111 14.6941L29.8138 13.0968C29.8112 13.0941 29.8086 13.0916 29.806 13.0889C29.8034 13.0864 29.8008 13.0838 29.7982 13.0812L28.2006 11.4836L19.7285 19.9582C18.5469 21.1402 16.6307 21.1403 15.449 19.9585L13.4185 17.9281C13.4141 17.9237 13.4097 17.9194 13.4052 17.915Z"
          fill="black"
        />
      </mask>
    </defs>
    <rect width="40" height="40" rx="10" fill={color} mask="url(#checkmarkMask)" />
  </svg>
);
