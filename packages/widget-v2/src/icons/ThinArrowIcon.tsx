type IconProps = {
  color?: string;
};

export const ThinArrowIcon = ({ color = 'currentColor' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="13"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M1 5.99999L6.02752 0.972473M1 5.99999L6.02752 11.0275M1 5.99999L11.0469 5.99999"
      stroke={color}
    />
  </svg>
);
