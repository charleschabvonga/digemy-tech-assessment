export type InvoiceColumnKey =
  | 'title'
  | 'total_amount'
  | 'state'
  | 'created_at'
  | 'actions'
  | 'id'

export interface InvoiceColumn {
  label: string
  key: InvoiceColumnKey
}

export const invoiceColumns: InvoiceColumn[] = [
  { label: 'Title/Description', key: 'title' },
  { label: 'Total Amount', key: 'total_amount' },
  { label: 'Status', key: 'state' },
  { label: 'Date Time Created', key: 'created_at' },
  { label: '', key: 'actions' },
  { label: 'ID', key: 'id' },
]


