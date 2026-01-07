import { ref } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { invoicesApi } from '@/api/invoices'
import { usePagination } from '@/composables/usePagination'
import { useLoading } from '@/composables/useLoading'
import { formatMoney } from '@/utils/money'
import { getStateBadgeClass } from '@/utils/state'
import type { Invoice } from '../show/useInvoiceShow'

type EmitEvent = 'loading' | 'cancel'
type EmitPayload = boolean | Invoice

type EmitFn =
  | ((event: EmitEvent, payload?: EmitPayload) => void)
  | undefined

export function useInvoicesIndex(emit?: EmitFn) {
  const router = useRouter()
  const { showLoading, hideLoading } = useLoading()

  const invoices = ref<Invoice[]>([])
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

  async function fetch(page: number | null = null, itemsPerPage: number | null = null) {
    loading.value = true
    showLoading('Loading invoices...')
    emit?.('loading', true)
    try {
      const currentPage = page || getCurrentPage()
      const currentPerPage = itemsPerPage || getCurrentPerPage()

      const res = await invoicesApi.list(currentPage, currentPerPage)
      const data = (res.data || []) as Invoice[]
      invoices.value = data
      setPagination(res as any)
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
      invoices.value = []
      setPagination({} as any)
    } finally {
      loading.value = false
      hideLoading()
      emit?.('loading', false)
    }
  }

  async function reload() {
    await fetch()
  }

  function handleViewInvoice(id: number | string) {
    router.push({ name: 'ShowInvoice', params: { id } })
  }

  function handleInvoiceCreated() {
    showCreateModal.value = false
    reload()
  }

  function handleCancel(invoice: Invoice) {
    emit?.('cancel', invoice)
  }

  function isRefund(invoice: Invoice): boolean {
    const s = invoice?.state_meta?.name
    return s === 'partially_paid' || s === 'fully_paid' || s === 'refunded'
  }

  function canCancel(invoice: Invoice): boolean {
    const s = invoice?.state_meta?.name
    return s !== 'cancelled'
  }

  function canShowRestore(invoice: Invoice): boolean {
    const s = invoice?.state_meta?.name
    return s === 'refunded' || s === 'partially_paid' || s === 'fully_paid'
  }

  function canShowTrash(invoice: Invoice): boolean {
    const s = invoice?.state_meta?.name
    return s === 'created' || s === 'awaiting_payment'
  }

  function isCancelDisabled(invoice: Invoice): boolean {
    const s = invoice?.state_meta?.name
    return s === 'refunded'
  }

  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return ''
    return dayjs(dateString).format('D MMMM YYYY, HH:mm')
  }

  function handlePerPageChangeWrapper(newPerPage: number) {
    perPage.value = newPerPage
    handlePerPageChange()
  }

  watchRouteQuery((page, per) => {
    fetch(page, per)
  })

  return {
    invoices,
    loading,
    showCreateModal,
    pagination,
    perPage,
    visiblePages,
    goToPage,
    handlePerPageChangeWrapper,
    initializePerPage,
    getCurrentPage,
    getCurrentPerPage,
    setPagination,
    fetch,
    reload,
    handleViewInvoice,
    handleInvoiceCreated,
    handleCancel,
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


