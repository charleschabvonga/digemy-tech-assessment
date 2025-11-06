import { ref, reactive } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { invoicesApi } from '@/api/invoices'

export function useInvoiceCreate(emit) {
  const { toast } = useToast()

  const form = reactive({
    title: '',
    description: '',
    totalAmount: null,
  })
  const loading = ref(false)
  const error = ref('')
  const fieldErrors = reactive({
    title: '',
    description: '',
    total_amount: '',
  })

  function resetFieldErrors() {
    fieldErrors.title = ''
    fieldErrors.description = ''
    fieldErrors.total_amount = ''
  }

  function validate() {
    resetFieldErrors()
    const title = (form.title || '').trim()
    const amount = Number(form.totalAmount)

    if (!title) fieldErrors.title = 'Title is required'
    if (Number.isNaN(amount) || amount < 0.01) {
      fieldErrors.total_amount = 'Total amount must be at least 0.01'
    }

    if (fieldErrors.title || fieldErrors.total_amount) {
      error.value = 'Please fix the highlighted fields.'
      return false
    }

    error.value = ''
    return true
  }

  function resetForm() {
    form.title = ''
    form.description = ''
    form.totalAmount = null
    resetFieldErrors()
    error.value = ''
  }

  async function handleSubmit() {
    if (loading.value) return
    if (!validate()) return

    loading.value = true
    emit?.('loading', true)

    try {
      await invoicesApi.create({
        title: form.title.trim(),
        description: form.description ? form.description.trim() : null,
        total_amount: Number(form.totalAmount),
      })

      toast({ title: 'Success', description: 'Invoice created successfully' })
      resetForm()
      emit?.('created')
      emit?.('close')
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Failed to create invoice'
      const errors = err?.response?.data?.errors || null

      resetFieldErrors()
      if (errors && typeof errors === 'object') {
        for (const [key, arr] of Object.entries(errors)) {
          if (Array.isArray(arr) && arr.length) {
            fieldErrors[key] = arr[0]
          }
        }
        msg = 'Please fix the highlighted fields.'
      }

      error.value = msg
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      loading.value = false
      emit?.('loading', false)
    }
  }

  return {
    form,
    loading,
    error,
    fieldErrors,
    handleSubmit,
    resetForm,
  }
}
