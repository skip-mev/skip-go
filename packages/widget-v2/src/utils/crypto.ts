export const convertHumanReadableAmountToCryptoAmount = (
  humanReadableAmount: number | string,
  decimals = 6
): string => {
  if (typeof humanReadableAmount === "string") {
    humanReadableAmount = parseFloat(humanReadableAmount);
  }
  const cryptoAmount = humanReadableAmount * Math.pow(10, decimals);
  return cryptoAmount.toString();
};

export const convertTokenAmountToHumanReadableAmount = (
  tokenAmount: number | string,
  decimals = 6
): string => {
  if (typeof tokenAmount === "string") {
    tokenAmount = parseFloat(tokenAmount);
  }
  const humanReadableAmount = tokenAmount / Math.pow(10, decimals);
  return humanReadableAmount.toFixed(decimals).replace(/(\.\d*?[1-9])0+|\.0*$/, "$1");
};
