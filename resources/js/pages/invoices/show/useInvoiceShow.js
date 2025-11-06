// pages/invoices/useInvoiceShow.js
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLoading } from '@/composables/useLoading'
import { invoicesApi } from '@/api/invoices'
import { paymentsApi } from '@/api/payments'
import { formatMoney } from '@/utils/money'
import { getStateBadgeClass, getStatusColor } from '@/utils/state'
import { paymentColumns } from './columns'

export function useInvoiceShow(props, emit) {
  const router = useRouter()
  const { toast } = useToast()
  const { showLoading, hideLoading } = useLoading()

  // state
  const invoice = ref(null)
  const payments = ref([])
  const loading = ref(true)
  const error = ref('')

  const sending = ref(false)
  const cancelling = ref(false)
  const reversing = ref(null)

  const showPaymentForm = ref(false)
  const showCancelConfirm = ref(false)
  const showReverseConfirm = ref(false)
  const pendingReverseId = ref(null)

  // fetch
  async function loadInvoice(showLoadingState = true) {
    if (showLoadingState) {
      loading.value = true
      showLoading('Loading invoice details...')
      emit?.('loading', true)
    }
    error.value = ''

    try {
      const data = await invoicesApi.show(props.id)
      invoice.value = data
      payments.value = (data.payments || [])
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } catch (err) {
      error.value = err?.response?.data?.message || 'Failed to load invoice'
    } finally {
      if (showLoadingState) {
        loading.value = false
        hideLoading()
        emit?.('loading', false)
      }
    }
  }

  // computed
  const totalPaid = computed(() => {
    const sum = payments.value.reduce((s, p) => s + Number(p.amount || 0), 0)
    return Number.isFinite(sum) ? sum : 0
  })

  const outstanding = computed(() => {
    const total = Number(invoice.value?.total_amount || 0)
    const out = total - totalPaid.value
    return Math.max(0, Number.isFinite(out) ? out : 0)
  })

  const canSend = computed(() => {
    const s = invoice.value?.state_meta?.name
    return s === 'created'
  })

  const canCancel = computed(() => {
    const s = invoice.value?.state_meta?.name
    return s !== 'cancelled' && s !== 'refunded'
  })

  const canmakePayment = computed(() => {
    const s = invoice.value?.state_meta?.name
    return (s === 'awaiting_payment' || s === 'partially_paid') && outstanding.value > 0.000001
  })

  const canReversePayment = computed(() => {
    const s = invoice.value?.state_meta?.name
    return s !== 'cancelled' && s !== 'refunded'
  })

  const isRefund = computed(() => {
    const s = invoice.value?.state_meta?.name
    return s === 'partially_paid' || s === 'fully_paid' || s === 'refunded'
  })

  const outstandingColor = computed(() => (outstanding.value > 0.000001 ? 'red' : 'gray'))

  const paymentTableDescription = computed(() => {
    const title = invoice.value?.title || ''
    const description = invoice.value?.description || ''
    if (title && description) return `${title} - ${description}`
    return title || description || undefined
  })

  // actions
  const goBack = () => {
    if (window.history.length > 1) router.back()
    else router.push({ name: 'Invoices' })
  }

  async function handleSend() {
    sending.value = true
    showLoading('Sending invoice...')
    emit?.('loading', true)
    try {
      await invoicesApi.send(props.id)
      toast({ title: 'Success', description: 'Invoice sent to customer successfully' })
      await loadInvoice(false)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send invoice'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      sending.value = false
      hideLoading()
      emit?.('loading', false)
    }
  }

  function handleCancel() {
    showCancelConfirm.value = true
  }

  async function confirmCancel() {
    cancelling.value = true
    const actionText = isRefund.value ? 'Refunding invoice...' : 'Cancelling invoice...'
    showLoading(actionText)
    emit?.('loading', true)
    try {
      await invoicesApi.cancel(props.id)
      const successText = isRefund.value ? 'Invoice refunded successfully' : 'Invoice cancelled successfully'
      toast({ title: 'Success', description: successText })
      showCancelConfirm.value = false
      router.push({ name: 'Invoices', query: { refresh: Date.now() } })
    } catch (err) {
      const actionText2 = isRefund.value ? 'refund' : 'cancel'
      const msg = err?.response?.data?.message || `Failed to ${actionText2} invoice`
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      cancelling.value = false
      hideLoading()
      emit?.('loading', false)
    }
  }

  function handleReversePayment(paymentId) {
    pendingReverseId.value = paymentId
    showReverseConfirm.value = true
  }

  async function confirmReverse() {
    if (!pendingReverseId.value) return
    reversing.value = pendingReverseId.value
    showLoading('Reversing payment...')
    emit?.('loading', true)
    try {
      await paymentsApi.delete(props.id, pendingReverseId.value)
      toast({ title: 'Success', description: 'Payment reversed successfully' })
      showReverseConfirm.value = false
      pendingReverseId.value = null
      await loadInvoice(false)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to reverse payment'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      reversing.value = null
      hideLoading()
      emit?.('loading', false)
    }
  }

  function handlePaymentCreated() {
    showPaymentForm.value = false
    return loadInvoice(false)
  }

  // utils
  const formatDate = (dateString) => (dateString ? dayjs(dateString).format('D MMMM YYYY, HH:mm') : '')

  return {
    // state
    invoice, payments, loading, error,
    sending, cancelling, reversing,
    showPaymentForm, showCancelConfirm, showReverseConfirm, pendingReverseId,
    paymentColumns,
    // computed
    totalPaid, outstanding, outstandingColor,
    canSend, canCancel, canmakePayment, canReversePayment, isRefund, paymentTableDescription,
    // actions
    loadInvoice, goBack, handleSend, handleCancel, confirmCancel, handleReversePayment, confirmReverse, handlePaymentCreated,
    // utils
    formatMoney, formatDate, getStateBadgeClass, getStatusColor,
  }
}
