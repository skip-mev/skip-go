type IconProps = {
  color?: string;
};

export const HistoryArrowIcon = ({ color = 'currentColor' }: IconProps) => (
  <svg
    width="10"
    height="9"
    viewBox="0 0 10 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.99905 8.941L7.36606 5.574H0.463055V4.196H7.36606L3.99905 0.828999H5.72806L9.78406 4.885L5.72806 8.941H3.99905Z"
      fill={color}
    />
  </svg>
);
