<template>
  <FormModal
    :show="show"
    title="Payment"
    :disable-close="loading"
    @close="$emit('close')"
  >
    <template #title>
      <div :class="headerClass">
        <Icon icon="mdi:credit-card" :class="headerIconClass" />
        <span :class="headerTitleClass">PAYMENT</span>
      </div>
    </template>

    <form @submit.prevent="handleSubmit">
      <div v-if="error" :class="errorClass">
        {{ error }}
      </div>

      <div>
        <label for="amount" :class="labelClass">
          Amount (Max: {{ formatMoney(maxAmount) }})
        </label>
        <input
          id="amount"
          v-model="amount"
          type="number"
          step="0.01"
          min="0"
          :max="maxAmount"
          required
          :class="inputClass"
          placeholder="0.00"
          :disabled="loading"
        />
      </div>

      <div :class="actionsClass">
        <Button
          type="button"
          variant="secondary"
          icon="mdi:close"
          :disabled="loading"
          @click="$emit('close')"
        >
          Add later
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon="mdi:credit-card"
          :loading="loading"
          :disabled="loading || parseFloat(amount || '0') > parseFloat(String(maxAmount))"
        >
          {{ loading ? 'Adding...' : 'Pay now' }}
        </Button>
      </div>
    </form>
  </FormModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { css } from '../../../../styled-system/css'
import { useToast } from '@/components/ui/toast/use-toast'
import { paymentsApi } from '@/api/payments'
import Button from '@/components/Button.vue'
import FormModal from '@/components/FormModal.vue'
import { formatMoney } from '@/utils/money'

const props = defineProps<{
  show?: boolean
  invoiceId: number | string
  maxAmount: number | string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const { toast } = useToast()
const amount = ref('')
const loading = ref(false)
const error = ref('')

function resetForm() {
  amount.value = ''
  error.value = ''
}

const headerClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.75rem',
})

const headerIconClass = css({
  width: '1.25rem',
  height: '1.25rem',
  color: 'rgb(37, 99, 235)',
  flexShrink: 0,
})

const headerTitleClass = css({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'rgb(37, 99, 235)',
})

const errorClass = css({
  backgroundColor: 'rgb(254, 242, 242)',
  borderWidth: '1px',
  borderColor: 'rgb(254, 202, 202)',
  color: 'rgb(185, 28, 28)',
  paddingInline: '1rem',
  paddingBlock: '0.75rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  marginBottom: '0.75rem',
})

const labelClass = css({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgb(55, 65, 81)',
  marginBottom: '0.5rem',
})

const inputClass = css({
  width: '100%',
  paddingInline: '0.75rem',
  paddingBlock: '0.5rem',
  borderWidth: '1px',
  borderColor: 'rgb(209, 213, 219)',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  outline: 'none',
  _focus: {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const actionsClass = css({
  display: 'flex',
  justifyContent: 'flex-end',
  columnGap: '0.75rem',
  paddingTop: '1rem',
})

const handleSubmit = async () => {
  const amountValue = parseFloat(amount.value)

  if (amountValue <= 0) {
    error.value = 'Amount must be greater than 0'
    return
  }

  if (amountValue > parseFloat(String(props.maxAmount))) {
    error.value = 'Amount cannot exceed outstanding balance'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await paymentsApi.create(props.invoiceId, amountValue)
    toast({
      title: 'Success',
      description: 'Payment added successfully',
      variant: 'default',
    })
    resetForm()
    emit('created')
    emit('close')
  } catch (err) {
    const anyErr = err as any
    const errorMsg =
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.errors?.amount?.[0] ||
      'Failed to add payment'
    error.value = errorMsg
    toast({
      title: 'Error',
      description: errorMsg,
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => props.show,
  newVal => {
    if (!newVal) {
      resetForm()
    }
  },
)
</script>