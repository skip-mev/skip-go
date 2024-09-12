
type IconProps = {
  color?: string;
};

export const TinyTriangleIcon = ({
  color = "currentColor",
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) => (
  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.44881 6.98877L0.420326 0.0112305L8.47729 0.0112305L4.44881 6.98877Z" fill={color} />
  </svg>
);
