const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export function formatYen(decimalValue: string | number): string {
  const value = Number(decimalValue);

  return Number.isFinite(value) ? yenFormatter.format(value) : String(decimalValue);
}
