import { withBoundProps } from "@/utils/misc";
import { IconProps } from ".";

export const ArrowIcon = ({
  color = "currentColor",
  backgroundColor = "transparent",
  direction = "right",
  className,
  maskedVersion = true,
}: IconProps) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform={
      direction === "down"
        ? "rotate(90)"
        : direction === "left"
          ? "rotate(180)"
          : direction === "up"
            ? "rotate(-90)"
            : direction === "top-right"
              ? "rotate(-45)"
              : undefined
    }
  >
    {maskedVersion ? (
      <>
        <defs>
          <mask id="arrowMask">
            <rect width="40" height="40" fill="white" />
            <path
              d="M20.1203 18.2749L9.84088 18.2749L9.84088 21.7251L20.1203 21.7251C21.3854 21.7251 22.0202 23.2548 21.1255 24.1496L17.206 28.0691L19.6465 30.5096L30.1582 19.9977L19.6511 9.49043L17.2106 11.9309L21.1278 15.8459C22.0225 16.7406 21.39 18.2726 20.1226 18.2726"
              fill="black"
            />
          </mask>
        </defs>
        <rect width="40" height="40" rx="10" fill={color} mask="url(#arrowMask)" />
      </>
    ) : (
      <>
        <rect width="40" height="40" rx="10" fill={backgroundColor} />
        <path
          d="M20.1203 18.2749L9.84088 18.2749L9.84088 21.7251L20.1203 21.7251C21.3854 21.7251 22.0202 23.2548 21.1255 24.1496L17.206 28.0691L19.6465 30.5096L30.1582 19.9977L19.6511 9.49043L17.2106 11.9309L21.1278 15.8459C22.0225 16.7406 21.39 18.2726 20.1226 18.2726"
          fill={color}
        />
      </>
    )}
  </svg>
);

export const RightArrowIcon = withBoundProps(ArrowIcon, { direction: "right" });

export const LeftArrowIcon = withBoundProps(ArrowIcon, { direction: "left" });
