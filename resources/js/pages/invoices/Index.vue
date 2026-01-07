<template>
  <div :class="pageClass">
    <div v-if="!loading" :class="tableCardClass">
      <EntityTable
        title="INVOICES"
        icon="mdi:file-document"
        description="View and manage all invoices"
        :columns="columns"
        :data="invoices"
        :action-button="{ show: true, label: 'Create Invoice', icon: 'mdi:plus' }"
        empty-state-icon="mdi:file-document-outline"
        empty-state-message="No invoices found"
        @action-click="showCreateModal = true"
      >
        <template #default="{ row: invoice }">
          <td :class="cellTitleClass">
            <div :class="titleTextClass">{{ invoice.title }}</div>
            <Tooltip v-if="invoice.description" :text="invoice.description" position="top-left" :multi-line="true">
              <div :class="descriptionTextClass">
                {{ invoice.description }}
              </div>
            </Tooltip>
            <div v-else :class="noDescriptionTextClass">No description</div>
          </td>

          <td :class="amountCellClass">
            {{ formatMoney(invoice.total_amount) }}
          </td>

          <td :class="statusCellClass">
            <Tooltip
              v-if="invoice.state_meta && invoice.state_meta.name === 'partially_paid' && invoice.total_paid"
            >
              <template #tooltip>
                Amount Paid: {{ formatMoney(invoice.total_paid) }}
              </template>
              <span :class="[statusBadgeBaseClass, getStateBadgeClass(invoice.state_meta.intent)]">
                {{ invoice.state_meta.display || invoice.state_meta.name }}
              </span>
            </Tooltip>
            <span v-else-if="invoice.state_meta" :class="[statusBadgeBaseClass, getStateBadgeClass(invoice.state_meta.intent)]">
              {{ invoice.state_meta.display || invoice.state_meta.name }}
            </span>
          </td>

          <td :class="dateCellClass">
            {{ formatDate(invoice.created_at) }}
          </td>

          <td :class="actionsCellClass">
            <div :class="actionsWrapperClass">
              <Tooltip text="View Invoice">
                <button
                  @click="handleViewInvoice(invoice.id)"
                  :class="viewButtonClass"
                  type="button"
                >
                  <Icon icon="mdi:eye" :class="actionIconClass" />
                </button>
              </Tooltip>

              <Tooltip v-if="canShowRestore(invoice)" text="Refund Invoice">
                <button
                  @click="handleCancel(invoice)"
                  :disabled="isCancelDisabled(invoice)"
                  :class="dangerButtonClass"
                  type="button"
                >
                  <Icon icon="mdi:restore" :class="actionIconClass" />
                </button>
              </Tooltip>

              <Tooltip v-if="canShowTrash(invoice)" text="Cancel Invoice">
                <button
                  @click="handleCancel(invoice)"
                  :disabled="isCancelDisabled(invoice)"
                  :class="dangerButtonClass"
                  type="button"
                >
                  <Icon icon="mdi:delete" :class="actionIconClass" />
                </button>
              </Tooltip>
            </div>
          </td>

          <td :class="idCellClass">
            {{ invoice.id }}
          </td>
        </template>
      </EntityTable>

      <CreateInvoice
        :show="showCreateModal"
        @close="showCreateModal = false"
        @created="handleInvoiceCreated"
      />
    </div>

    <div :class="footerClass">
      <Pagination
        :pagination="pagination"
        :per-page="perPage"
        :visible-pages="visiblePages"
        :loading="loading"
        :show-border-top="false"
        @page-change="goToPage"
        @per-page-change="handlePerPageChangeWrapper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { css } from '../../../../styled-system/css'
import EntityTable from '../../components/EntityTable.vue'
import Pagination from '@/components/Pagination.vue'
import Tooltip from '@/components/Tooltip.vue'
import CreateInvoice from './Create.vue'
import { useInvoicesIndex } from './index/useInvoicesIndex'
import { invoiceColumns as columns } from './index/columns'

const emit = defineEmits<{
  (e: 'cancel', invoice: any): void
  (e: 'loading', value: boolean): void
}>()

const vm = useInvoicesIndex((event, payload) => {
  if (event === 'loading') {
    emit('loading', payload as boolean)
  }
})

onMounted(() => {
  vm.initializePerPage()
  const page = vm.getCurrentPage()
  const itemsPerPage = vm.getCurrentPerPage()
  vm.fetch(page, itemsPerPage)
})

defineExpose({ reload: vm.reload })

const {
  invoices, loading, showCreateModal,
  pagination, perPage, visiblePages,
  goToPage, handlePerPageChangeWrapper,
  handleViewInvoice, handleInvoiceCreated,
  handleCancel, formatMoney, getStateBadgeClass, formatDate,
  isRefund, canCancel, canShowRestore, canShowTrash, isCancelDisabled,
} = vm

const pageClass = css({
  position: 'relative',
  minHeight: '100vh',
  paddingBottom: '5rem',
})

const tableCardClass = css({
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  overflowX: 'auto',
})

const cellBase = {
  paddingInline: '1.5rem',
  paddingBlock: '1rem',
  fontSize: '0.875rem',
}

const cellTitleClass = css({
  ...cellBase,
  color: 'rgb(17, 24, 39)',
})

const titleTextClass = css({
  fontWeight: 500,
  marginBottom: '0.25rem',
})

const descriptionTextClass = css({
  fontSize: '0.75rem',
  color: 'rgb(107, 114, 128)',
  maxWidth: '16rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const noDescriptionTextClass = css({
  fontSize: '0.75rem',
  color: 'rgb(156, 163, 175)',
  fontStyle: 'italic',
})

const amountCellClass = css({
  ...cellBase,
  whiteSpace: 'nowrap',
  fontWeight: 600,
  color: 'rgb(17, 24, 39)',
})

const statusCellClass = css({
  ...cellBase,
  whiteSpace: 'nowrap',
})

const dateCellClass = css({
  ...cellBase,
  whiteSpace: 'nowrap',
  color: 'rgb(107, 114, 128)',
})

const actionsCellClass = css({
  ...cellBase,
  whiteSpace: 'nowrap',
  textAlign: 'right',
})

const actionsWrapperClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  columnGap: '0.5rem',
})

const statusBadgeBaseClass = css({
  paddingInline: '0.5rem',
  paddingBlock: '0.25rem',
  fontSize: '0.75rem',
  fontWeight: 500,
  borderRadius: '9999px',
})

const actionButtonBase = {
  padding: '0.375rem',
  borderRadius: '0.375rem',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transitionProperty: 'background-color, color',
  transitionDuration: '150ms',
}

const viewButtonClass = css({
  ...actionButtonBase,
  color: 'rgb(37, 99, 235)',
  backgroundColor: 'transparent',
  _hover: {
    color: 'rgb(30, 64, 175)',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
})

const dangerButtonClass = css({
  ...actionButtonBase,
  color: 'rgb(220, 38, 38)',
  backgroundColor: 'transparent',
  _hover: {
    color: 'rgb(185, 28, 28)',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: 'transparent',
  },
})

const actionIconClass = css({
  width: '1.25rem',
  height: '1.25rem',
})

const idCellClass = css({
  paddingInline: '1.5rem',
  paddingBlock: '1rem',
  fontSize: '0.875rem',
  color: 'rgb(107, 114, 128)',
  backgroundColor: 'rgb(243, 244, 246)',
  textAlign: 'right',
  whiteSpace: 'nowrap',
})

const footerClass = css({
  position: 'fixed',
  insetInline: 0,
  insetBlockEnd: 0,
  zIndex: 50,
  backgroundColor: 'white',
  borderTopWidth: '1px',
  borderTopColor: 'rgb(229, 231, 235)',
  boxShadow: '0 -1px 2px rgba(15, 23, 42, 0.08)',
})
</script>
