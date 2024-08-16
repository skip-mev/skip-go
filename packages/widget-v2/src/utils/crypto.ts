export const getFormattedAssetAmount = (
  amount: number | string,
  decimals?: number
) => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  const result = amount / Math.pow(10, decimals ?? 6);
  return result.toFixed(decimals ?? 6).replace(/(\.\d*?[1-9])0+|\.0*$/, '$1');
};
