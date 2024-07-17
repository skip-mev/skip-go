export function nameToRgba(name: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = name;
    context.fillRect(0, 0, 1, 1);
  }
  const rgbaArray = context?.getImageData(0, 0, 1, 1).data;
  return rgbaArray ? Uint8ClampedArrayToRGBAString(rgbaArray) : undefined;
}

function Uint8ClampedArrayToRGBAString(array: Uint8ClampedArray) {
  if (array.length !== 4) {
    throw new Error('Array length must be 4 to convert to RGBA string');
  }

  const [r, g, b, a] = array;

  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

export function lightOrDark(color: any) {
  let r: number, g: number, b: number, hsp: number;

  if (color.match(/^rgb/)) {
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  if (hsp > 127.5) {
    return 'light';
  } else {
    return 'dark';
  }
}
