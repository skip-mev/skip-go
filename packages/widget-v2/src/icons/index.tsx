import { RightArrowIcon, LeftArrowIcon } from './ArrowIcon';
import { CheckmarkIcon } from './CheckmarkIcon';
import { PlusIcon } from './PlusIcon';
import { SignatureIcon } from './SignatureIcon';
import { SwapIcon } from './SwapIcon';
import { WarningIcon } from './WarningIcon';
import { TriangleWarningIcon } from './TriangleWarningIcon';

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
}

type IconMap = {
  [key in ICONS]: (args: any) => JSX.Element | null;
};

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
};
