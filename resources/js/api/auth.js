const STORAGE_USER_KEY = 'auth_user'
const STORAGE_TOKEN_KEY = 'auth_token'

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
  if (!raw) return null
  const parts = raw.split('; ')
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const eq = part.indexOf('=')
    if (eq === -1) {
      if (part === name) return ''
      continue
    }
    const key = part.slice(0, eq)
    if (key === name) {
      return decodeURIComponent(part.slice(eq + 1))
    }
  }
  return null
}

export function getCsrfHeader() {
  const xsrf = getCookie('XSRF-TOKEN')
  return xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}
}

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USER_KEY)) || null } catch { return null }
}
function setStoredUser(user) {
  if (user) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_USER_KEY)
}

function getStoredToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY) || null
}
function setStoredToken(token) {
  if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token)
  else localStorage.removeItem(STORAGE_TOKEN_KEY)
}

function getAuthHeader() {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function ensureCsrf() {
  await fetch('/sanctum/csrf-cookie', { credentials: 'include' })
}

export const authApi = {
  isAuthenticated() {
    return !!getStoredUser()
  },

  getCurrentUser() {
    return getStoredUser()
  },

  async me() {
    const token = getStoredToken()
    if (!token) return null

    const res = await fetch('/api/v1/auth/user', {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json', ...getAuthHeader() },
    })
    if (!res.ok) return null
    const user = await res.json()
    setStoredUser(user)
    return user
  },

  async login({ email, password }) {
    await ensureCsrf()
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...getCsrfHeader(),
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      let msg = 'Login failed'
      try {
        const data = await res.json()
        msg = data.message || (data.errors && Object.values(data.errors).flat()[0]) || msg
      } catch {}
      throw new Error(msg)
    }

    const data = await res.json()
    setStoredToken(data.token)
    setStoredUser(data.user)
    return data.user
  },

  async register({ firstname, lastname, email, password, password_confirmation }) {
    await ensureCsrf()
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...getCsrfHeader(),
      },
      body: JSON.stringify({ firstname, lastname, email, password, password_confirmation }),
    })

    if (!res.ok) {
      let msg = 'Registration failed'
      try {
        const data = await res.json()
        msg = data.message || (data.errors && Object.values(data.errors).flat()[0]) || msg
      } catch {}
      const err = new Error(msg)
      err.response = { data: await res.json().catch(() => ({})) }
      throw err
    }

    const data = await res.json()
    setStoredToken(data.token)
    setStoredUser(data.user)
    return data.user
  },

  async logout() {
    try {
      await ensureCsrf()
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          ...getCsrfHeader(),
          ...getAuthHeader(),
        },
      })
    } catch {
      // ignore
    } finally {
      setStoredUser(null)
      setStoredToken(null)
    }
  },
}

const apiClient = {
  async request(method, url, options = {}) {
    const { params, data, headers: extraHeaders, ...restOptions } = options

    let fullUrl = url.startsWith('/api') ? url : `/api/v1${url}`

    if (params) {
      const search = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value == null) return
        if (Array.isArray(value)) {
          value.forEach(v => search.append(key, v))
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
