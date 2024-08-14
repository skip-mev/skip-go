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

export const getBrandButtonTextColor = (color: string) => {
  let r: number, g: number, b: number, hsp: number;

  color = getHexColor(color);

  r = parseInt(color.slice(1, 3), 16);
  g = parseInt(color.slice(3, 5), 16);
  b = parseInt(color.slice(5, 7), 16);

  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  const typeOfColor = hsp > 127.5 ? 'light' : 'dark';
  return typeOfColor === 'light' ? 'black' : 'white';
};
