export enum COLORS {
  red = '#FF1616',
  green = '#5FBF00',
  orange = '#FF7A00',
  backgroundError = '#430000',
  backgroundWarning = '#411F00',
  gray = '#FFFFFF80',
}

export const opacityToHex = (p: number) => {
  const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
  const intValue = Math.round((percent / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
};

export const getHexColor = (color: string) => {
  var context = document.createElement('canvas').getContext('2d');
  if (context) {
    context.fillStyle = color;
    return context.fillStyle;
  }
  return color;
};
