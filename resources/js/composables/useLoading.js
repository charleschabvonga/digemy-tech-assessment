import { ref } from 'vue'

const _isLoading = ref(false)
const _loadingMessage = ref('Loading...')

export function useLoading() {
  function setLoading(loading, message = 'Loading...') {
    _isLoading.value = loading
    _loadingMessage.value = message
  }

  function showLoading(message = 'Loading...') {
    setLoading(true, message)
  }

  function hideLoading() {
    setLoading(false)
  }

  return {
    isLoading: _isLoading,
    loadingMessage: _loadingMessage,
    setLoading,
    showLoading,
    hideLoading,
  }
}

