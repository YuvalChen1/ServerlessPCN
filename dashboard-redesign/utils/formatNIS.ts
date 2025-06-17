export function formatNIS(amount: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}