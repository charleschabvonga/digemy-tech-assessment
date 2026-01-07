import { api } from '@/api/httpClient'

export interface InvoiceListResponse {
  data?: unknown[]
  [key: string]: unknown
}

export const invoicesApi = {
  async list(page = 1, perPage = 5): Promise<InvoiceListResponse> {
    const response = await api.get<InvoiceListResponse>('/invoices', {
      params: { page, per_page: perPage },
    })
    return response.data
  },

  async show<T = any>(id: number | string): Promise<T> {
    const response = await api.get<T>(`/invoices/${id}`)
    return response.data
  },

  async create(data: unknown): Promise<any> {
    const response = await api.post('/invoices', data)
    return response.data
  },

  async send(id: number | string): Promise<any> {
    const response = await api.post(`/invoices/${id}/send`)
    return response.data
  },

  async cancel(id: number | string): Promise<void> {
    await api.delete(`/invoices/${id}`)
  },
}


