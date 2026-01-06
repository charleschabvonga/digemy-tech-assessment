<template>
  <Loading v-if="loading" message="Loading invoice details..." />

  <div v-else class="bg-white shadow rounded-lg p-6">
      <!-- header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4 flex-wrap">
          <Tooltip text="Back to Invoices">
            <button @click="goBack" class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md" type="button">
              <Icon icon="mdi:arrow-left" class="w-5 h-5" />
            </button>
          </Tooltip>
          <div class="flex items-center gap-2">
            <Icon icon="mdi:file-document" class="w-6 h-6 text-blue-600" />
            <h3 class="text-2xl font-bold text-blue-600">INVOICE #{{ invoice?.id }}</h3>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Button v-if="canSend" variant="primary" icon="mdi:send" :loading="sending" :disabled="sending" @click="handleSend">
            {{ sending ? 'Sending...' : 'Send to Customer' }}
          </Button>
          <Button v-if="canmakePayment" variant="primary-green" icon="mdi:credit-card" @click="showPaymentForm = true">
            Make Payment
          </Button>
          <Button v-if="canCancel" variant="secondary" icon="mdi:close" :loading="cancelling" :disabled="cancelling" @click="handleCancel">
            {{ cancelling ? 'Cancelling...' : 'Cancel Invoice' }}
          </Button>
        </div>
      </div>

      <div v-if="error" class="text-center py-8 text-red-600">{{ error }}</div>

      <div v-else-if="invoice">
        <!-- stats -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Amount"
            :value="formatMoney(invoice.total_amount)"
            value-color="gray"
            icon="mdi:currency-usd"
          />
          <StatCard
            label="Total Paid"
            :value="formatMoney(totalPaid)"
            value-color="green"
            icon="mdi:check-circle"
          />
          <StatCard
            label="Outstanding"
            :value="formatMoney(outstanding)"
            :value-color="outstandingColor"
            icon="mdi:currency-usd-off"
          />
          <StatCard
            v-if="invoice?.state_meta"
            label="Status"
            value=""
            :value-color="getStatusColor(invoice.state_meta?.intent)"
            icon="mdi:flag"
          >
            <template #value>
              <span
                :class="getStateBadgeClass(invoice.state_meta?.intent)"
                class="px-3 py-1 text-sm font-medium rounded-full inline-block"
              >
                {{ invoice.state_meta?.display || invoice.state_meta?.name }}
              </span>
            </template>
          </StatCard>
        </div>

        <!-- payments -->
        <div>
          <CreatePayment
            v-if="showPaymentForm"
            :invoice-id="invoice.id"
            :max-amount="outstanding"
            @close="showPaymentForm = false"
            @created="handlePaymentCreated"
          />

          <div class="bg-white shadow rounded-lg overflow-x-auto">
            <EntityTable
              title="PAYMENTS"
              icon="mdi:credit-card"
              :description="paymentTableDescription"
              :columns="paymentColumns"
              :data="payments"
              empty-state-icon="mdi:wallet"
              empty-state-message="No payments yet"
            >
            <template #default="{ row: payment }">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ formatMoney(payment.amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(payment.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <Tooltip v-if="canReversePayment" text="Reverse Payment">
                  <button
                    @click="handleReversePayment(payment.id)"
                    :disabled="reversing === payment.id"
                    class="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <Icon v-if="reversing === payment.id" icon="mdi:loading" class="w-5 h-5 animate-spin" />
                    <Icon v-else icon="mdi:restore" class="w-5 h-5" />
                  </button>
                </Tooltip>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 bg-gray-100 text-right w-20">
                {{ payment.id }}
              </td>
            </template>
          </EntityTable>
          </div>
        </div>
      </div>
  </div>

  <!-- modals -->
    <ConfirmModal
      :show="showCancelConfirm"
      title="Cancel Invoice"
      message="Are you sure you want to cancel this invoice? This will also reverse all payments."
      confirm-text="Cancel Invoice"
      :loading="cancelling"
      @confirm="confirmCancel"
      @cancel="showCancelConfirm = false"
    />
    <ConfirmModal
      :show="showReverseConfirm"
      title="Reverse Payment"
      message="Are you sure you want to reverse this payment?"
      confirm-text="Reverse Payment"
      :loading="reversing !== null"
      @confirm="confirmReverse"
      @cancel="showReverseConfirm = false; pendingReverseId = null"
    />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Loading from '@/components/Loading.vue'
import Button from '@/components/Button.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import EntityTable from '@/components/EntityTable.vue'
import StatCard from '@/components/StatCard.vue'
import Tooltip from '@/components/Tooltip.vue'
import CreatePayment from '../payments/Create.vue'
import { useInvoiceShow } from './show/useInvoiceShow'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
})

const emit = defineEmits(['loading'])

const vm = useInvoiceShow(props, emit)

onMounted(() => vm.loadInvoice())
watch(() => props.id, () => vm.loadInvoice())

const {
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
  formatMoney,
  formatDate,
  getStateBadgeClass,
  getStatusColor,
} = vm
</script>
