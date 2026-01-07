import { ref } from 'vue'

const isLoadingRef = ref(false)
const loadingMessageRef = ref('Loading...')

export function useLoading() {
  function setLoading(loading: boolean, message = 'Loading...'): void {
    isLoadingRef.value = loading
    loadingMessageRef.value = message
  }

  function showLoading(message = 'Loading...'): void {
    setLoading(true, message)
  }

  function hideLoading(): void {
    setLoading(false)
  }

  return {
    isLoading: isLoadingRef,
    loadingMessage: loadingMessageRef,
    setLoading,
    showLoading,
    hideLoading,
  }
}


