export type PaymentColumnKey = 'amount' | 'date' | 'actions' | 'id'

export interface PaymentColumn {
  label: string
  key: PaymentColumnKey
}

export const paymentColumns: PaymentColumn[] = [
  { label: 'Amount', key: 'amount' },
  { label: 'Date', key: 'date' },
  { label: '', key: 'actions' },
  { label: 'ID', key: 'id' },
]


