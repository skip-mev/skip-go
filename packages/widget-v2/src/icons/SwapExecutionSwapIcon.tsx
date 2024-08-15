type IconProps = {
  color?: string;
};

export const SwapExecutionSwapIcon = ({
  color = 'currentColor',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="15"
    viewBox="0 0 9 15"
    fill="none"
  >
    <path
      d="M8.20703 4.86573L5.12779 4.86573L5.12779 7.94459L3.11602 7.94459L3.11602 4.86573L0.0367735 4.86573L4.10137 0.801147L8.20703 4.86573ZM4.14243 14.2781L0.0367857 10.2135L3.11603 10.2135L3.11603 5.65862L5.12779 5.65862L5.12779 10.2135L8.20703 10.2135L4.14243 14.2781Z"
      fill={color}
    />
  </svg>
);
