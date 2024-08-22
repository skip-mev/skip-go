type IconProps = {
  color?: string;
};

export const SwapExecutionSendIcon = ({
  color = "currentColor",
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="9"
    height="11"
    viewBox="0 0 9 11"
    fill="none"
    {...props}
  >
    <path
      d="M4.36704 7.83984L0.261395 3.77528L3.34064 3.77528L3.34064 0.4544L5.3524 0.4544L5.3524 1.49781L5.3524 3.77528L8.43164 3.77528L4.36704 7.83984Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.43164 8.83984V8.97095V10.5L6.77148 10.5L1.91992 10.5L0.259766 10.5V8.97095H0.261475L0.261475 8.83984H8.43164Z"
      fill={color}
    />
  </svg>
);
