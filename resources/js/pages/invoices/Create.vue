<template>
  <FormModal
    :show="show"
    title="Create Invoice"
    :disable-close="loading"
    @close="$emit('close')"
  >
    <template #title>
      <div :class="headerClass">
        <Icon icon="mdi:file-document" :class="headerIconClass" />
        <span :class="headerTitleClass">CREATE INVOICE</span>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" :aria-busy="loading">
      <div v-if="error" :class="errorClass">
        {{ error }}
      </div>

      <div>
        <label for="title" :class="labelClass">
          Title <span :class="labelRequiredClass">*</span>
        </label>
        <input
          id="title"
          v-model.trim="form.title"
          type="text"
          required
          :aria-invalid="Boolean(fieldErrors.title)"
          :class="inputClass"
          placeholder="Invoice title"
          :disabled="loading"
        />
        <p v-if="fieldErrors.title" :class="fieldErrorTextClass">{{ fieldErrors.title }}</p>
      </div>

      <div>
        <label for="description" :class="labelClass">
          Description
        </label>
        <textarea
          id="description"
          v-model.trim="form.description"
          rows="3"
          :aria-invalid="Boolean(fieldErrors.description)"
          :class="textareaClass"
          placeholder="Invoice description"
          :disabled="loading"
        ></textarea>
        <p v-if="fieldErrors.description" :class="fieldErrorTextClass">
          {{ fieldErrors.description }}
        </p>
      </div>

      <div>
        <label for="totalAmount" :class="labelClass">
          Total Amount <span :class="labelRequiredClass">*</span>
        </label>
        <input
          id="totalAmount"
          v-model.number="form.totalAmount"
          type="number"
          inputmode="decimal"
          step="0.01"
          min="0.01"
          required
          :aria-invalid="Boolean(fieldErrors.total_amount)"
          :class="inputClass"
          placeholder="0.00"
          :disabled="loading"
        />
        <p v-if="fieldErrors.total_amount" :class="fieldErrorTextClass">
          {{ fieldErrors.total_amount }}
        </p>
      </div>

      <div :class="actionsClass">
        <Button
          type="button"
          variant="secondary"
          icon="mdi:close"
          :disabled="loading"
          @click="$emit('close')"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon="mdi:plus"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'Creating...' : 'Create' }}
        </Button>
      </div>
    </form>
  </FormModal>
</template>

<script setup>
import { watch, toRefs } from 'vue'
import { Icon } from '@iconify/vue'
import { css } from '../../../../styled-system/css'
import Button from '@/components/Button.vue'
import FormModal from '@/components/FormModal.vue'
import { useInvoiceCreate } from './create/useInvoiceCreate'

const props = defineProps({
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'created', 'loading'])
const { form, loading, error, fieldErrors, handleSubmit, resetForm } = useInvoiceCreate(emit)
const { show } = toRefs(props)

watch(show, (val) => {
  if (!val) resetForm()
})

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
  marginBottom: '0.25rem',
})

const labelRequiredClass = css({
  color: 'rgb(220, 38, 38)',
})

const inputBase = {
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
}

const inputClass = css(inputBase)
const textareaClass = css({ ...inputBase })

const fieldErrorTextClass = css({
  marginTop: '0.25rem',
  fontSize: '0.75rem',
  color: 'rgb(220, 38, 38)',
})

const actionsClass = css({
  display: 'flex',
  justifyContent: 'flex-end',
  columnGap: '0.5rem',
  paddingTop: '1rem',
})
</script>
