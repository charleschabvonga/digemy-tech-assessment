// Money formatter utility
const money = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(amount) {
  return money.format(Number(amount || 0))
}

