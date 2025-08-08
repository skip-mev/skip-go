import { IconProps } from ".";

export const WarningIcon = ({
  color = "currentColor",
  backgroundColor = "transparent",
}: IconProps) => (
  <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.480713" width="40" height="40" rx="10" fill={backgroundColor} />
    <path
      d="M18.9042 24.141L17.4816 16.1506V11.6555C17.4816 10.5509 18.3771 9.65552 19.4816 9.65552H20.5182C21.6228 9.65552 22.5182 10.5509 22.5182 11.6555V16.1506L21.0957 24.141H18.9042ZM19.0972 31.3059C17.9926 31.3059 17.0972 30.4105 17.0972 29.3059V28.6975C17.0972 27.5929 17.9926 26.6975 19.0972 26.6975H20.9027C22.0073 26.6975 22.9027 27.5929 22.9027 28.6975V29.3059C22.9027 30.4105 22.0073 31.3059 20.9027 31.3059H19.0972Z"
      fill={color}
    />
  </svg>
);
