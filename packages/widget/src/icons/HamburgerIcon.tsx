import { IconProps } from ".";

export const HamburgerIcon = ({ color = "currentColor" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 10" fill="none">
    <line x1="10" y1="1.25903" x2="-4.37114e-08" y2="1.25903" stroke={color} />
    <line x1="10" y1="5.09158" x2="-3.30781e-08" y2="5.09158" stroke={color} />
    <line x1="10" y1="8.92412" x2="-3.30781e-08" y2="8.92412" stroke={color} />
  </svg>
);
