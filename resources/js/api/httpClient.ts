import { getAuthHeader, getCsrfHeader, ensureCsrf } from './auth'

type Primitive = string | number | boolean

interface RequestOptions {
  params?: Record<string, Primitive | Primitive[] | null | undefined>
  data?: unknown
  headers?: Record<string, string>
  [key: string]: unknown
}

interface ApiResponse<T = unknown> {
  data: T
}

const apiClient = {
  async request<T = unknown>(
    method: string,
    url: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { params, data, headers: extraHeaders, ...restOptions } = options

    let fullUrl = url.startsWith('/api') ? url : `/api/v1${url}`

    if (params) {
      const search = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value == null) return
        if (Array.isArray(value)) {
          value.forEach(v => search.append(key, String(v)))
        } else {
          search.append(key, String(value))
        }
      })
      const qs = search.toString()
      if (qs) fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs
    }

    const methodUpper = method.toUpperCase()
    const isStateChanging = !['GET', 'HEAD', 'OPTIONS'].includes(methodUpper)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeader(),
      ...(isStateChanging ? getCsrfHeader() : {}),
      ...(extraHeaders ?? {}),
    }

    const response = await fetch(fullUrl, {
      method: methodUpper,
      credentials: 'include',
      headers,
      ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
      ...restOptions,
    })

    if (!response.ok) {
      if (response.status === 419 && !(options as any)._retried) {
        await ensureCsrf()
        return this.request<T>(method, url, { ...options, _retried: true })
      }
      let errorMessage = 'Request failed'
      try {
        const errorData = (await response.json()) as any
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        errorMessage = 'Request failed'
      }
      const err: any = new Error(errorMessage)
      err.status = response.status
      throw err
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return { data: (await response.json()) as T }
    }
    return { data: (await response.text()) as unknown as T }
  },

  get<T = unknown>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, options)
  },
  post<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, { ...(options ?? {}), data })
  },
  put<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, { ...(options ?? {}), data })
  },
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, { ...(options ?? {}), data })
  },
  delete<T = unknown>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, options)
  },
}

export const api = apiClient


