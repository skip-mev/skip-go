import BigNumber from "bignumber.js";

export const convertHumanReadableAmountToCryptoAmount = (
  humanReadableAmount: number | string,
  decimals: number,
): string => {
  const cryptoAmount = new BigNumber(humanReadableAmount).shiftedBy(decimals);
  return cryptoAmount.toFixed(0);
};

export const convertTokenAmountToHumanReadableAmount = (
  tokenAmount: number | string,
  decimals: number,
): string => {
  const humanReadableAmount = new BigNumber(tokenAmount).shiftedBy(-decimals);
  return humanReadableAmount
    .toFixed(decimals, BigNumber.ROUND_DOWN)
    .replace(/(\.\d*?[1-9])(?:0+|\.0*)$/, "$1");
};
