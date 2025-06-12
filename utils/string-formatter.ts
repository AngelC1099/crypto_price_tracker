export const formatToMoney = (
  value: number,
  options: { minDecimals: number, maxDecimals: number } = { minDecimals: 0, maxDecimals: 0 }
) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: options.minDecimals,
    maximumFractionDigits: options.maxDecimals,
  });
};
