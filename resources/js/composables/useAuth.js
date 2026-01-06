import { ref, computed } from 'vue'
import { authApi } from '../api/auth'

const _user = ref(null)
const _isAuthenticated = ref(false)
let _initialized = false
const emitter = new EventTarget()
const emit = (t) => emitter.dispatchEvent(new CustomEvent(t))

export function useAuth() {
  if (!_initialized) {
    _user.value = authApi.getCurrentUser()
    _isAuthenticated.value = !!_user.value
    _initialized = true
  }

  const user = computed(() => _user.value)
  const isAuthenticated = computed(() => _isAuthenticated.value)

  async function checkAuth() {
    if (!_user.value) {
      const u = await authApi.me().catch(() => null)
      _user.value = u
    }
    _isAuthenticated.value = !!_user.value
    emit('change')
    return _isAuthenticated.value
  }

  async function login(credentials) {
    const u = await authApi.login(credentials)
    _user.value = u
    _isAuthenticated.value = true
    emit('login'); emit('change')
    return u
  }

  async function register(data) {
    const u = await authApi.register(data)
    _user.value = u
    _isAuthenticated.value = true
    emit('login'); emit('change')
    return u
  }

  async function logout() {
    try { await authApi.logout() }
    finally {
      _user.value = null
      _isAuthenticated.value = false
      emit('logout'); emit('change')
    }
  }

  function on(event, handler) {
    const wrapped = () => handler()
    emitter.addEventListener(event, wrapped)
    return () => emitter.removeEventListener(event, wrapped)
  }

  return { user, isAuthenticated, checkAuth, login, register, logout, on }
}
