const STORAGE_USER_KEY = 'auth_user'
const STORAGE_TOKEN_KEY = 'auth_token'

export interface AuthUser {
  id: number
  email: string
  firstname?: string
  lastname?: string
  [key: string]: unknown
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
  if (!raw) return null
  const parts = raw.split('; ')
  for (let i = 0; i < parts.length; i += 1) {
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

export function getCsrfHeader(): Record<string, string> {
  const xsrf = getCookie('XSRF-TOKEN')
  return xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function setStoredUser(user: AuthUser | null): void {
  if (user) {
    sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(STORAGE_USER_KEY)
  }
}

function getStoredToken(): string | null {
  return sessionStorage.getItem(STORAGE_TOKEN_KEY) || null
}

function setStoredToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(STORAGE_TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(STORAGE_TOKEN_KEY)
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function ensureCsrf(): Promise<void> {
  await fetch('/sanctum/csrf-cookie', { credentials: 'include' })
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  firstname: string
  lastname: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthApi {
  isAuthenticated(): boolean
  getCurrentUser(): AuthUser | null
  me(): Promise<AuthUser | null>
  login(payload: LoginPayload): Promise<AuthUser>
  register(payload: RegisterPayload): Promise<AuthUser>
  logout(): Promise<void>
}

export const authApi: AuthApi = {
  isAuthenticated(): boolean {
    return !!getStoredUser()
  },

  getCurrentUser(): AuthUser | null {
    return getStoredUser()
  },

  async me(): Promise<AuthUser | null> {
    const token = getStoredToken()
    if (!token) return null

    const res = await fetch('/api/v1/auth/user', {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json', ...getAuthHeader() },
    })
    if (!res.ok) return null
    const user = (await res.json()) as AuthUser
    setStoredUser(user)
    return user
  },

  async login({ email, password }: LoginPayload): Promise<AuthUser> {
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
        const data = (await res.json()) as any
        msg =
          data.message ||
          (data.errors && Object.values<string[]>(data.errors).flat()[0]) ||
          msg
      } catch {
        msg = 'Login failed'
      }
      throw new Error(msg)
    }

    const data = (await res.json()) as { token: string; user: AuthUser }
    setStoredToken(data.token)
    setStoredUser(data.user)
    return data.user
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    await ensureCsrf()
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...getCsrfHeader(),
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      let msg = 'Registration failed'
      try {
        const data = (await res.json()) as any
        msg =
          data.message ||
          (data.errors && Object.values<string[]>(data.errors).flat()[0]) ||
          msg
      } catch {
        msg = 'Registration failed'
      }
      const err: any = new Error(msg)
      try {
        err.response = { data: await res.json() }
      } catch {
        err.response = { data: {} }
      }
      throw err
    }

    const data = (await res.json()) as { token: string; user: AuthUser }
    setStoredToken(data.token)
    setStoredUser(data.user)
    return data.user
  },

  async logout(): Promise<void> {
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
    } finally {
      setStoredUser(null)
      setStoredToken(null)
    }
  },
}


