type IconProps = {
  color?: string;
  className?: string;
  spin?: boolean;
};

export const BridgeArrowIcon = ({
  color = "currentColor",
  className,
  spin,
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M7.48395 6.5705L7.48395 0.568512H5.46938L5.46938 6.5705C5.46938 7.30917 4.57625 7.67985 4.05381 7.15741L1.76526 4.86889L0.34029 6.29384L6.478 12.4315L12.613 6.29653L11.1881 4.87157L8.9022 7.15875C8.37976 7.68119 7.48528 7.31186 7.48528 6.57185"
      fill={color}
    />
  </svg>
);
