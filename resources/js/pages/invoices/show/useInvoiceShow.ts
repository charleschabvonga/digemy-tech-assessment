import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLoading } from '@/composables/useLoading'
import { invoicesApi } from '@/api/invoices'
import { paymentsApi } from '@/api/payments'
import { formatMoney } from '@/utils/money'
import { getStateBadgeClass, getStatusColor } from '@/utils/state'
import type { StateIntent } from '@/utils/state'
import { paymentColumns } from './columns'

interface InvoiceShowProps {
  id: number | string
}

export type InvoiceStateName =
  | 'created'
  | 'awaiting_payment'
  | 'partially_paid'
  | 'fully_paid'
  | 'refunded'
  | 'cancelled'

export interface InvoiceStateMeta {
  name?: InvoiceStateName
  display?: string
  intent?: StateIntent
}

export interface InvoicePayment {
  id: number | string
  amount: number | string
  created_at: string
}

export interface Invoice {
  id: number | string
  title?: string | null
  description?: string | null
  total_amount: number | string
  state_meta?: InvoiceStateMeta
  payments?: InvoicePayment[]
}

type EmitFn = ((event: 'loading', payload: boolean) => void) | undefined

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const anyError = error as {
      response?: { data?: { message?: unknown } }
      message?: unknown
    }

    const responseMessage = anyError.response?.data?.message
    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage
    }

    if (typeof anyError.message === 'string' && anyError.message.trim()) {
      return anyError.message
    }
  }

  return fallback
}

export function useInvoiceShow(props: InvoiceShowProps, emit?: EmitFn) {
  const router = useRouter()
  const { toast } = useToast()
  const { showLoading, hideLoading } = useLoading()

  const invoice = ref<Invoice | null>(null)
  const payments = ref<InvoicePayment[]>([])
  const loading = ref(true)
  const error = ref('')

  const sending = ref(false)
  const cancelling = ref(false)
  const reversing = ref<number | string | null>(null)

  const showPaymentForm = ref(false)
  const showCancelConfirm = ref(false)
  const showReverseConfirm = ref(false)
  const pendingReverseId = ref<number | string | null>(null)

  async function loadInvoice(showLoadingState = true): Promise<void> {
    if (showLoadingState) {
      loading.value = true
      showLoading('Loading invoice details...')
      emit?.('loading', true)
    }
    error.value = ''

    try {
      const data = await invoicesApi.show<Invoice>(props.id)
      invoice.value = data
      payments.value = (data.payments || [])
        .slice()
        .sort(
          (a: InvoicePayment, b: InvoicePayment) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Failed to load invoice')
    } finally {
      if (showLoadingState) {
        loading.value = false
        hideLoading()
        emit?.('loading', false)
      }
    }
  }

  const totalPaid = computed(() => {
    const sum = payments.value.reduce(
      (s, p) => s + Number(p.amount || 0),
      0,
    )
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
    return (
      (s === 'awaiting_payment' || s === 'partially_paid') &&
      outstanding.value > 0.000001
    )
  })

  const canReversePayment = computed(() => {
    const s = invoice.value?.state_meta?.name
    return s !== 'cancelled' && s !== 'refunded'
  })

  const isRefund = computed(() => {
    const s = invoice.value?.state_meta?.name
    return s === 'partially_paid' || s === 'fully_paid' || s === 'refunded'
  })

  const outstandingColor = computed(() =>
    outstanding.value > 0.000001 ? 'red' : 'gray',
  )

  const paymentTableDescription = computed(() => {
    const title = invoice.value?.title || ''
    const description = invoice.value?.description || ''
    if (title && description) return `${title} - ${description}`
    return title || description || undefined
  })

  const goBack = () => {
    if (window.history.length > 1) router.back()
    else router.push({ name: 'Invoices' })
  }

  async function handleSend(): Promise<void> {
    sending.value = true
    showLoading('Sending invoice...')
    emit?.('loading', true)
    try {
      await invoicesApi.send(props.id)
      toast({
        title: 'Success',
        description: 'Invoice sent to customer successfully',
      })
      await loadInvoice(false)
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to send invoice')
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      sending.value = false
      hideLoading()
      emit?.('loading', false)
    }
  }

  function handleCancel(): void {
    showCancelConfirm.value = true
  }

  async function confirmCancel(): Promise<void> {
    cancelling.value = true
    const actionText = isRefund.value
      ? 'Refunding invoice...'
      : 'Cancelling invoice...'
    showLoading(actionText)
    emit?.('loading', true)
    try {
      await invoicesApi.cancel(props.id)
      const successText = isRefund.value
        ? 'Invoice refunded successfully'
        : 'Invoice cancelled successfully'
      toast({ title: 'Success', description: successText })
      showCancelConfirm.value = false
      router.push({ name: 'Invoices', query: { refresh: Date.now() } })
    } catch (err: unknown) {
      const action = isRefund.value ? 'refund' : 'cancel'
      const msg = getErrorMessage(err, `Failed to ${action} invoice`)
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      cancelling.value = false
      hideLoading()
      emit?.('loading', false)
    }
  }

  function handleReversePayment(paymentId: number | string): void {
    pendingReverseId.value = paymentId
    showReverseConfirm.value = true
  }

  async function confirmReverse(): Promise<void> {
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
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to reverse payment')
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      reversing.value = null
      hideLoading()
      emit?.('loading', false)
    }
  }

  function handlePaymentCreated(): Promise<void> {
    showPaymentForm.value = false
    return loadInvoice(false)
  }

  function openPaymentForm(): void {
    showPaymentForm.value = true
  }

  function closePaymentForm(): void {
    showPaymentForm.value = false
  }

  const formatDate = (dateString: string | null | undefined): string =>
    dateString ? dayjs(dateString).format('D MMMM YYYY, HH:mm') : ''

  return {
    invoice,
    payments,
    loading,
    error,
    sending,
    cancelling,
    reversing,
    showPaymentForm,
    showCancelConfirm,
    showReverseConfirm,
    pendingReverseId,
    paymentColumns,
    totalPaid,
    outstanding,
    outstandingColor,
    canSend,
    canCancel,
    canmakePayment,
    canReversePayment,
    isRefund,
    paymentTableDescription,
    loadInvoice,
    goBack,
    handleSend,
    handleCancel,
    confirmCancel,
    handleReversePayment,
    confirmReverse,
    handlePaymentCreated,
    openPaymentForm,
    closePaymentForm,
    formatMoney,
    formatDate,
    getStateBadgeClass,
    getStatusColor,
  }
}


