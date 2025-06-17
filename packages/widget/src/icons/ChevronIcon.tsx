type IconProps = {
  color?: string;
  backgroundColor?: string;
  noBackground?: boolean;
  backgroundRx?: number | string;
};

export const ChevronIcon = ({
  color = "currentColor",
  backgroundColor = "transparent",
  noBackground = false,
  backgroundRx = 10,
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="40"
    viewBox={noBackground ? "8 13 24 14" : "0 0 40 40"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {!noBackground && <rect width="40" height="40" rx={backgroundRx} fill={backgroundColor} />}
    <path
      d="M11.9383 15.031L9.5 17.4693L17.0773 25.0449C17.0785 25.0461 17.0798 25.0474 17.081 25.0486L20.0023 27.9692L29.281 18.6907C29.2832 18.6884 29.2855 18.6861 29.2878 18.6838L30.5 17.4716L28.0617 15.0333L22.9273 20.1692C22.9246 20.1719 22.922 20.1745 22.9193 20.1771C21.3072 21.7811 18.7025 21.7826 17.0887 20.1813C17.0847 20.1774 17.0808 20.1736 17.0769 20.1696L11.9383 15.031Z"
      fill={color}
    />
  </svg>
);
