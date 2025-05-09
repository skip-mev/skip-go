import { RightArrowIcon, LeftArrowIcon } from "./ArrowIcon";
import { CheckmarkIcon } from "./CheckmarkIcon";
import { PlusIcon } from "./PlusIcon";
import { SignatureIcon } from "./SignatureIcon";
import { SwapIcon } from "./SwapIcon";
import { WarningIcon } from "./WarningIcon";
import { TriangleWarningIcon } from "./TriangleWarningIcon";
import { PenIcon } from "./PenIcon";
import { HistoryIcon } from "./HistoryIcon";
import { ThinArrowIcon } from "./ThinArrowIcon";
import { HamburgerIcon } from "./HamburgerIcon";
import { HorizontalLineIcon } from "./HorizontalLineIcon";
import { ReactElement, SVGProps } from "react";
import { GoFastIcon } from "./GoFastIcon";

export enum ICONS {
  none,
  plus,
  checkmark,
  rightArrow,
  leftArrow,
  swap,
  warning,
  triangleWarning,
  signature,
  pen,
  history,
  thinArrow,
  hamburger,
  horizontalLine,
  goFast,
}

type IconProps = SVGProps<SVGSVGElement> & {
  color?: string;
  direction?: "right" | "left";
  backgroundColor?: string;
};

type IconMap = Record<ICONS, (props: IconProps) => ReactElement | null>;

export const iconMap: IconMap = {
  [ICONS.none]: () => null,
  [ICONS.plus]: PlusIcon,
  [ICONS.checkmark]: CheckmarkIcon,
  [ICONS.rightArrow]: RightArrowIcon,
  [ICONS.leftArrow]: LeftArrowIcon,
  [ICONS.swap]: SwapIcon,
  [ICONS.warning]: WarningIcon,
  [ICONS.triangleWarning]: TriangleWarningIcon,
  [ICONS.signature]: SignatureIcon,
  [ICONS.pen]: PenIcon,
  [ICONS.history]: HistoryIcon,
  [ICONS.thinArrow]: ThinArrowIcon,
  [ICONS.hamburger]: HamburgerIcon,
  [ICONS.horizontalLine]: HorizontalLineIcon,
  [ICONS.goFast]: GoFastIcon,
};
