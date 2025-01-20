export const opacityToHex = (p: number) => {
  const percent = Math.max(0, Math.min(100, p));
  const intValue = Math.round((percent / 100) * 255);
  const hexValue = intValue.toString(16);
  return hexValue.padStart(2, "0").toUpperCase();
};

export const getAverageColorFromGradient = (gradient: string): string => {
  // Extract colors from gradient
  const colors = gradient.match(/(#[0-9a-f]{6}|rgb\([^)]+\)|[a-z]+)/gi) || [];

  if (colors.length === 0) return "#FFFFFF"; // Default fallback

  // Convert all colors to RGB format
  const rgbColors = colors.map((color) => {
    const context = document.createElement("canvas").getContext("2d");
    if (context) {
      context.fillStyle = color;
      return context.fillStyle;
    }
    return color;
  });

  // Calculate average RGB values
  const averageColor = rgbColors.reduce(
    (acc, color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return {
        r: acc.r + r / rgbColors.length,
        g: acc.g + g / rgbColors.length,
        b: acc.b + b / rgbColors.length,
      };
    },
    { r: 0, g: 0, b: 0 },
  );

  // Convert back to hex
  const r = Math.round(averageColor.r).toString(16).padStart(2, "0");
  const g = Math.round(averageColor.g).toString(16).padStart(2, "0");
  const b = Math.round(averageColor.b).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
};

export const getHexColor = (color: string) => {
  // Check if it's a gradient
  if (color.includes("gradient")) {
    return getAverageColorFromGradient(color);
  }

  // Handle solid colors as before
  const context = document.createElement("canvas").getContext("2d");
  if (context) {
    context.fillStyle = color;
    return context.fillStyle;
  }
  return color;
};

export const getBrandButtonTextColor = (color: string) => {
  // Handle gradient
  if (color.includes("gradient")) {
    color = getAverageColorFromGradient(color);
  }

  // Get hex color
  color = getHexColor(color);

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Calculate perceived brightness
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp > 127.5 ? "black" : "white";
};
