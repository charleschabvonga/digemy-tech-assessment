import { api } from '@/api/httpClient'

export const paymentsApi = {
  async create(invoiceId: number | string, amount: number | string): Promise<any> {
    const response = await api.post(`/invoices/${invoiceId}/payments`, {
      amount: parseFloat(String(amount)),
    })
    return response.data
  },

  async delete(invoiceId: number | string, paymentId: number | string): Promise<void> {
    await api.delete(`/invoices/${invoiceId}/payments/${paymentId}`)
  },
}


