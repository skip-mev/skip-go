type IconProps = {
  color?: string;
  backgroundColor?: string;
};

export const FilledWarningIcon = ({
  color = "currentColor",
  backgroundColor = "transparent",
}: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.90918" width="20" height="20" rx="3.6856" fill={backgroundColor} />
    <path
      d="M10.9095 12.39C10.629 12.39 10.3919 12.1823 10.355 11.9042L9.78327 7.59277V5.08761C9.78327 4.47696 10.2783 3.98193 10.889 3.98193H10.9301C11.5407 3.98193 12.0357 4.47696 12.0357 5.08761V7.59277L11.464 11.9042C11.4271 12.1823 11.19 12.39 10.9095 12.39ZM10.717 16.018C10.1064 16.018 9.61133 15.523 9.61133 14.9124V14.5617C9.61133 13.9511 10.1064 13.4561 10.717 13.4561H11.102C11.7127 13.4561 12.2077 13.9511 12.2077 14.5617V14.9124C12.2077 15.523 11.7127 16.018 11.102 16.018H10.717Z"
      fill={color}
    />
  </svg>
);
