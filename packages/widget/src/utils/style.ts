export const convertToPxValue = (value?: string | number): string => {
  if (!value) return "0px";
  return typeof value === "number" ? `${value}px` : value;
};
