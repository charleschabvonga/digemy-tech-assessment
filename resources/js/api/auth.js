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
  try { return JSON.parse(sessionStorage.getItem(STORAGE_USER_KEY)) || null } catch { return null }
}
function setStoredUser(user) {
  if (user) sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
  else sessionStorage.removeItem(STORAGE_USER_KEY)
}

function getStoredToken() {
  return sessionStorage.getItem(STORAGE_TOKEN_KEY) || null
}
function setStoredToken(token) {
  if (token) sessionStorage.setItem(STORAGE_TOKEN_KEY, token)
  else sessionStorage.removeItem(STORAGE_TOKEN_KEY)
}

export function getAuthHeader() {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function ensureCsrf() {
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
