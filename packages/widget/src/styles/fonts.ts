import thin from '../assets/fonts/ABCDiatype-Thin.woff2';
import light from '../assets/fonts/ABCDiatype-Light.woff2';
import regular from '../assets/fonts/ABCDiatype-Regular.woff2';
import medium from '../assets/fonts/ABCDiatype-Medium.woff2';
import bold from '../assets/fonts/ABCDiatype-Bold.woff2';
import black from '../assets/fonts/ABCDiatype-Black.woff2';

import monoRegular from '../assets/fonts/ABCDiatypeMono-Regular.woff2';
import monoMedium from '../assets/fonts/ABCDiatypeMono-Medium.woff2';

export const fonts = `
@font-face {
  font-family: ABCDiatype;
  font-weight: 100;
  src: url(${thin}) format(woff2);
}
@font-face {
  font-family: ABCDiatype;
  font-weight: 300;
  src: url(${light}) format(woff2);
}
@font-face {
  font-family: ABCDiatype;
  font-weight: 400;
  src: url(${regular}) format(woff2);
}
@font-face {
  font-family: ABCDiatype;
  font-weight: 500;
  src: url(${medium}) format(woff2);
}
@font-face {
  font-family: ABCDiatype;
  font-weight: 700;
  src: url(${bold}) format(woff2);
}
@font-face {
  font-family: ABCDiatype;
  font-weight: 900;
  src: url(${black}) format(woff2);
}

@font-face {
  font-family: ABCDiatypeMono;
  font-weight: 400;
  src: url(${monoRegular}) format(woff2);
}
@font-face {
  font-family: ABCDiatypeMono;
  font-weight: 500;
  src: url(${monoMedium}) format(woff2);
}
`;
