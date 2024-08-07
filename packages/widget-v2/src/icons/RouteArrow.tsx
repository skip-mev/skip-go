type IconProps = {
  color?: string;
};

export const RouteArrow = ({ color = 'black' }: IconProps) => (
  <svg
    width="9"
    height="11"
    viewBox="0 0 9 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.8108 1.87099L4.62035 3.73224C5.01216 4.13524 4.73524 4.82459 4.17993 4.82459L0.876057 4.82459L0.876056 6.43207L4.18067 6.43282C4.7345 6.43282 5.01289 7.12217 4.62108 7.52518L2.80933 9.3887L3.91406 10.525L8.67323 5.62984L3.91553 0.736215L2.8108 1.87251L2.8108 1.87099Z"
      fill={color}
    />
  </svg>
);
