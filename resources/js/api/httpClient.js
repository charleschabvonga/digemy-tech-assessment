import { getAuthHeader, getCsrfHeader, ensureCsrf } from './auth'

const apiClient = {
  async request(method, url, options = {}) {
    const { params, data, headers: extraHeaders, ...restOptions } = options

    let fullUrl = url.startsWith('/api') ? url : `/api/v1${url}`

    if (params) {
      const search = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value == null) return
        if (Array.isArray(value)) {
          value.forEach((v) => search.append(key, v))
        } else {
          search.append(key, value)
        }
      })
      const qs = search.toString()
      if (qs) fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs
    }

    const methodUpper = method.toUpperCase()
    const isStateChanging = !['GET', 'HEAD', 'OPTIONS'].includes(methodUpper)

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeader(),
      ...(isStateChanging ? getCsrfHeader() : {}),
      ...extraHeaders,
    }

    const response = await fetch(fullUrl, {
      method: methodUpper,
      credentials: 'include',
      headers,
      ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
      ...restOptions,
    })

    if (!response.ok) {
      if (response.status === 419) {
        await ensureCsrf()
        return this.request(method, url, { ...options, _retried: true })
      }
      let errorMessage = 'Request failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {}
      const err = new Error(errorMessage)
      err.status = response.status
      throw err
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return { data: await response.json() }
    }
    return { data: await response.text() }
  },

  get(url, options) {
    return this.request('GET', url, options)
  },
  post(url, data, options) {
    return this.request('POST', url, { ...options, data })
  },
  put(url, data, options) {
    return this.request('PUT', url, { ...options, data })
  },
  patch(url, data, options) {
    return this.request('PATCH', url, { ...options, data })
  },
  delete(url, options) {
    return this.request('DELETE', url, options)
  },
}

export const api = apiClient


