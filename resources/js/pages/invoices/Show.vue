<template>
  <Loading v-if="loading" message="Loading invoice details..." />

  <div v-else :class="cardClass">
      <div :class="headerClass">
        <div :class="headerLeftClass">
          <Tooltip text="Back to Invoices">
            <button @click="goBack" :class="backButtonClass" type="button">
              <Icon icon="mdi:arrow-left" :class="backIconClass" />
            </button>
          </Tooltip>
          <div :class="headerTitleWrapperClass">
            <Icon icon="mdi:file-document" :class="headerIconClass" />
            <h3 :class="headerTitleClass">INVOICE #{{ invoice?.id }}</h3>
          </div>
        </div>
        <div :class="headerActionsClass">
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

      <div v-if="error" :class="errorClass">{{ error }}</div>

      <div v-else-if="invoice">
        <!-- stats -->
        <div :class="statsGridClass">
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
              <span :class="[statusBadgeBaseClass, getStateBadgeClass(invoice.state_meta?.intent)]">
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

          <div :class="paymentsCardClass">
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
              <td :class="paymentAmountCellClass">
                {{ formatMoney(payment.amount) }}
              </td>
              <td :class="paymentDateCellClass">
                {{ formatDate(payment.created_at) }}
              </td>
              <td :class="paymentActionsCellClass">
                <Tooltip v-if="canReversePayment" text="Reverse Payment">
                  <button
                    @click="handleReversePayment(payment.id)"
                    :disabled="reversing === payment.id"
                    :class="reverseButtonClass"
                    type="button"
                  >
                    <Icon
                      v-if="reversing === payment.id"
                      icon="mdi:loading"
                      :class="reverseLoadingIconClass"
                    />
                    <Icon v-else icon="mdi:restore" :class="reverseIconClass" />
                  </button>
                </Tooltip>
              </td>
              <td :class="paymentIdCellClass">
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
import { css } from '../../../../styled-system/css'
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

const cardClass = css({
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  padding: '1.5rem',
})

const headerClass = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
})

const headerLeftClass = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
})

const backButtonClass = css({
  padding: '0.5rem',
  borderRadius: '0.375rem',
  border: 'none',
  cursor: 'pointer',
  color: 'rgb(75, 85, 99)',
  backgroundColor: 'transparent',
  transitionProperty: 'background-color, color',
  transitionDuration: '150ms',
  _hover: {
    color: 'rgb(17, 24, 39)',
    backgroundColor: 'rgb(243, 244, 246)',
  },
})

const backIconClass = css({
  width: '1.25rem',
  height: '1.25rem',
})

const headerTitleWrapperClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.5rem',
})

const headerIconClass = css({
  width: '1.5rem',
  height: '1.5rem',
  color: 'rgb(37, 99, 235)',
})

const headerTitleClass = css({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'rgb(37, 99, 235)',
})

const headerActionsClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.75rem',
})

const errorClass = css({
  textAlign: 'center',
  paddingBlock: '2rem',
  color: 'rgb(220, 38, 38)',
})

const statsGridClass = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: '1rem',
  marginBottom: '1.5rem',
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
})

const statusBadgeBaseClass = css({
  paddingInline: '0.75rem',
  paddingBlock: '0.25rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  borderRadius: '9999px',
  display: 'inline-block',
})

const paymentsCardClass = css({
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  overflowX: 'auto',
  marginTop: '1.5rem',
})

const paymentCellBase = {
  paddingInline: '1.5rem',
  paddingBlock: '1rem',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
}

const paymentAmountCellClass = css({
  ...paymentCellBase,
  fontWeight: 600,
  color: 'rgb(17, 24, 39)',
})

const paymentDateCellClass = css({
  ...paymentCellBase,
  color: 'rgb(107, 114, 128)',
})

const paymentActionsCellClass = css({
  ...paymentCellBase,
})

const reverseButtonClass = css({
  padding: '0.375rem',
  borderRadius: '0.375rem',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgb(220, 38, 38)',
  backgroundColor: 'transparent',
  transitionProperty: 'background-color, color',
  transitionDuration: '150ms',
  _hover: {
    color: 'rgb(185, 28, 28)',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const reverseIconBase = {
  width: '1.25rem',
  height: '1.25rem',
}

const reverseIconClass = css({
  ...reverseIconBase,
})

const reverseLoadingIconClass = css({
  ...reverseIconBase,
  animation: 'spin 1s linear infinite',
})

const paymentIdCellClass = css({
  paddingInline: '1.25rem',
  paddingBlock: '1rem',
  fontSize: '0.875rem',
  color: 'rgb(107, 114, 128)',
  backgroundColor: 'rgb(243, 244, 246)',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  width: '5rem',
})
</script>
