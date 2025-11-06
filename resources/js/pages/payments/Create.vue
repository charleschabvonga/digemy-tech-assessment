<template>
  <FormModal
    :show="show"
    title="Payment"
    :disable-close="loading"
    @close="$emit('close')"
  >
    <template #title>
      <div class="flex items-center gap-3">
        <Icon icon="mdi:credit-card" class="w-5 h-5 text-blue-600 flex-shrink-0" />
        <span class="text-lg font-semibold text-blue-600">PAYMENT</span>
      </div>
    </template>

    <form @submit.prevent="handleSubmit">
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
        {{ error }}
      </div>

      <div>
        <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
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
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
          :disabled="loading"
        />
      </div>

      <div class="flex justify-end gap-3 pt-4">
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
          icon="mdi:credit-card"
          :loading="loading"
          :disabled="loading || parseFloat(amount || 0) > parseFloat(maxAmount)"
        >
          {{ loading ? 'Adding...' : 'Pay Now' }}
        </Button>
      </div>
    </form>
  </FormModal>
</template>

<script>
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { paymentsApi } from '@/api/payments';
import Button from '@/components/Button.vue';
import FormModal from '@/components/FormModal.vue';
import { formatMoney } from '@/utils/money';

export default {
  name: 'PaymentsCreate',
  components: {
    Icon,
    Button,
    FormModal
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    invoiceId: {
      type: [Number, String],
      required: true
    },
    maxAmount: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['close', 'created'],
  setup(props, { emit }) {
    const { toast } = useToast();
    const amount = ref('');
    const loading = ref(false);
    const error = ref('');

    function resetForm() {
      amount.value = '';
      error.value = '';
    }

    const handleSubmit = async () => {
      const amountValue = parseFloat(amount.value);
      
      if (amountValue <= 0) {
        error.value = 'Amount must be greater than 0';
        return;
      }

      if (amountValue > parseFloat(props.maxAmount)) {
        error.value = 'Amount cannot exceed outstanding balance';
        return;
      }

      loading.value = true;
      error.value = '';

      try {
        await paymentsApi.create(props.invoiceId, amountValue);
        toast({
          title: 'Success',
          description: 'Payment added successfully',
          variant: 'default'
        });
        resetForm();
        emit('created');
        emit('close');
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.response?.data?.errors?.amount?.[0] || 'Failed to add payment';
        error.value = errorMsg;
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive'
        });
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.show, (newVal) => {
      if (!newVal) {
        resetForm();
      }
    });

    return {
      amount,
      loading,
      error,
      handleSubmit,
      formatMoney
    };
  }
};
</script>

