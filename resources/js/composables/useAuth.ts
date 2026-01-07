import { ref, computed } from 'vue'
import { authApi, type AuthUser } from '../api/auth'

type AuthEvent = 'change' | 'login' | 'logout'

const userRef = ref<AuthUser | null>(null)
const isAuthenticatedRef = ref(false)
let initialized = false
const emitter = new EventTarget()

const emit = (event: AuthEvent): void => {
  emitter.dispatchEvent(new CustomEvent(event))
}

export function useAuth() {
  if (!initialized) {
    userRef.value = authApi.getCurrentUser()
    isAuthenticatedRef.value = !!userRef.value
    initialized = true
  }

  const user = computed(() => userRef.value)
  const isAuthenticated = computed(() => isAuthenticatedRef.value)

  async function checkAuth(): Promise<boolean> {
    if (!userRef.value) {
      const u = await authApi.me().catch(() => null)
      userRef.value = u
    }
    isAuthenticatedRef.value = !!userRef.value
    emit('change')
    return isAuthenticatedRef.value
  }

  async function login(credentials: {
    email: string
    password: string
  }): Promise<AuthUser> {
    const u = await authApi.login(credentials)
    userRef.value = u
    isAuthenticatedRef.value = true
    emit('login')
    emit('change')
    return u
  }

  async function register(data: {
    firstname: string
    lastname: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<AuthUser> {
    const u = await authApi.register(data)
    userRef.value = u
    isAuthenticatedRef.value = true
    emit('login')
    emit('change')
    return u
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } finally {
      userRef.value = null
      isAuthenticatedRef.value = false
      emit('logout')
      emit('change')
    }
  }

  function on(event: AuthEvent, handler: () => void): () => void {
    const wrapped = () => handler()
    emitter.addEventListener(event, wrapped)
    return () => emitter.removeEventListener(event, wrapped)
  }

  return { user, isAuthenticated, checkAuth, login, register, logout, on }
}


