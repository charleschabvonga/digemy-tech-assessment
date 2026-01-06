<template>
  <FormModal
    :show="show"
    title="Create Invoice"
    :disable-close="loading"
    @close="$emit('close')"
  >
    <template #title>
      <div class="flex items-center gap-3">
        <Icon icon="mdi:file-document" class="w-5 h-5 text-blue-600 flex-shrink-0" />
        <span class="text-lg font-semibold text-blue-600">CREATE INVOICE</span>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" :aria-busy="loading">
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Title <span class="text-red-600">*</span>
        </label>
        <input
          id="title"
          v-model.trim="form.title"
          type="text"
          required
          :aria-invalid="Boolean(fieldErrors.title)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Invoice title"
          :disabled="loading"
        />
        <p v-if="fieldErrors.title" class="mt-1 text-xs text-red-600">{{ fieldErrors.title }}</p>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          v-model.trim="form.description"
          rows="3"
          :aria-invalid="Boolean(fieldErrors.description)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Invoice description"
          :disabled="loading"
        ></textarea>
        <p v-if="fieldErrors.description" class="mt-1 text-xs text-red-600">{{ fieldErrors.description }}</p>
      </div>

      <div>
        <label for="totalAmount" class="block text-sm font-medium text-gray-700 mb-1">
          Total Amount <span class="text-red-600">*</span>
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
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
          :disabled="loading"
        />
        <p v-if="fieldErrors.total_amount" class="mt-1 text-xs text-red-600">{{ fieldErrors.total_amount }}</p>
      </div>

      <div class="flex justify-end gap-2 pt-4">
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
</script>
