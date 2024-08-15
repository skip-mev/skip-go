type IconProps = {
  color?: string;
};

export const SwapExecutionBridgeIcon = ({
  color = 'currentColor',
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="9"
    height="10"
    viewBox="0 0 9 10"
    fill="none"
    {...props}
  >
    <path
      d="M4.14243 9.26414L0.0367859 5.19958L3.11603 5.19958L3.11603 0.644653L5.12779 0.644653L5.12779 5.19958L8.20703 5.19958L4.14243 9.26414Z"
      fill={color}
    />
  </svg>
);
