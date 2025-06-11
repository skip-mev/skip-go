export const convertToPxValue = (value?: string | number): string => {
  if (value === undefined || value === null) {
    return "0px";
  }
  return typeof value === "number" ? `${value}px` : value;
};
