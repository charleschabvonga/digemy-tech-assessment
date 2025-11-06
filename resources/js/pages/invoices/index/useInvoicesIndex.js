import { ref } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { invoicesApi } from '@/api/invoices'
import { usePagination } from '@/composables/usePagination'
import { useLoading } from '@/composables/useLoading'
import { formatMoney } from '@/utils/money'
import { getStateBadgeClass } from '@/utils/state'

export function useInvoicesIndex(emit) {
  const router = useRouter()
  const { showLoading, hideLoading } = useLoading()

  const invoices = ref([])
  const loading = ref(true)
  const showCreateModal = ref(false)

  const {
    pagination,
    perPage,
    visiblePages,
    goToPage,
    handlePerPageChange,
    getCurrentPage,
    getCurrentPerPage,
    initializePerPage,
    setPagination,
    watchRouteQuery,
  } = usePagination('Invoices', 5)

  async function fetch(page = null, itemsPerPage = null) {
    loading.value = true
    showLoading('Loading invoices...')
    emit?.('loading', true)
    try {
      const currentPage = page || getCurrentPage()
      const currentPerPage = itemsPerPage || getCurrentPerPage()

      const res = await invoicesApi.list(currentPage, currentPerPage)
      invoices.value = res.data || []
      setPagination(res)
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
      invoices.value = []
      setPagination({})
    } finally {
      loading.value = false
      hideLoading()
      emit?.('loading', false)
    }
  }

  async function reload() {
    await fetch()
  }

  function handleViewInvoice(id) {
    router.push({ name: 'ShowInvoice', params: { id } })
  }

  function handleInvoiceCreated() {
    showCreateModal.value = false
    reload()
  }

  function handleCancel(invoice) {
    emit?.('cancel', invoice)
  }

  function isRefund(invoice) {
    const s = invoice?.state_meta?.name
    return s === 'partially_paid' || s === 'fully_paid' || s === 'refunded'
  }

  function canCancel(invoice) {
    const s = invoice?.state_meta?.name
    return s !== 'cancelled'
  }

  function canShowRestore(invoice) {
    const s = invoice?.state_meta?.name
    return s === 'refunded' || s === 'partially_paid' || s === 'fully_paid'
  }
  
  function canShowTrash(invoice) {
    const s = invoice?.state_meta?.name
    return s === 'created' || s === 'awaiting_payment'
  }

  function isCancelDisabled(invoice) {
    const s = invoice?.state_meta?.name
    return s === 'refunded'
  }

  function formatDate(dateString) {
    if (!dateString) return ''
    return dayjs(dateString).format('D MMMM YYYY, HH:mm')
  }

  function handlePerPageChangeWrapper(newPerPage) {
    perPage.value = newPerPage
    handlePerPageChange()
  }

  // wire pagination watcher
  watchRouteQuery((page, per) => {
    fetch(page, per)
  })

  // public API for Index.vue
  return {
    // state
    invoices,
    loading,
    showCreateModal,
    // pagination
    pagination,
    perPage,
    visiblePages,
    goToPage,
    handlePerPageChangeWrapper,
    initializePerPage,
    getCurrentPage,
    getCurrentPerPage,
    setPagination,
    // actions
    fetch,
    reload,
    handleViewInvoice,
    handleInvoiceCreated,
    handleCancel,
    // utils
    formatMoney,
    getStateBadgeClass,
    formatDate,
    isRefund,
    canCancel,
    canShowRestore,
    canShowTrash,
    isCancelDisabled,
  }
}
