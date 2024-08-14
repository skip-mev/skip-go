export const getFormattedAssetAmount = (
  amount: number | string,
  decimals?: number
) => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  return amount / Math.pow(10, decimals ?? 6);
};
