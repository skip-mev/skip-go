export function formatMaxFraction(amount: string | number, fraction = 6) {
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;
  const { format } = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fraction,
  });
  return format(amountNumber);
}

export function formatPercent(amount: string | number) {
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;
  return percentFormatter.format(amountNumber);
}

export function formatShortDate(date: string | Date) {
  const dateObject = typeof date === "string" ? new Date(date) : date;
  return shortDateFormatter.format(dateObject);
}

export function formatUSD(amount: string | number) {
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;
  const minDisplayable = 1 / Math.pow(10, 2);

  if (amountNumber > 0 && amountNumber < minDisplayable) {
    return `< ${usdFormatter.format(minDisplayable)}`;
  }

  return usdFormatter.format(amountNumber);
}

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
