const moneyFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(amount: number | string | null | undefined): string {
  const numeric = Number(amount ?? 0)
  return moneyFormatter.format(Number.isFinite(numeric) ? numeric : 0)
}


