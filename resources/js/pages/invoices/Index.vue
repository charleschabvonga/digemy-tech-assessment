<template>
  <div class="relative min-h-screen pb-20">
    <div v-if="!loading" class="bg-white shadow rounded-lg overflow-x-auto">
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
          <td class="px-6 py-4 text-sm text-gray-900">
            <div class="font-medium mb-1">{{ invoice.title }}</div>
            <Tooltip v-if="invoice.description" :text="invoice.description" position="top-left" :multi-line="true">
              <div class="text-xs text-gray-500 truncate max-w-xs">
                {{ invoice.description }}
              </div>
            </Tooltip>
            <div v-else class="text-xs text-gray-400 italic">No description</div>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
            {{ formatMoney(invoice.total_amount) }}
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <Tooltip
              v-if="invoice.state_meta && invoice.state_meta.name === 'partially_paid' && invoice.total_paid"
            >
              <template #tooltip>
                Amount Paid: {{ formatMoney(invoice.total_paid) }}
              </template>
              <span
                :class="getStateBadgeClass(invoice.state_meta.intent)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ invoice.state_meta.display || invoice.state_meta.name }}
              </span>
            </Tooltip>
            <span
              v-else-if="invoice.state_meta"
              :class="getStateBadgeClass(invoice.state_meta.intent)"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ invoice.state_meta.display || invoice.state_meta.name }}
            </span>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(invoice.created_at) }}
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
            <div class="flex items-center justify-end gap-2">
              <Tooltip text="View Invoice">
                <button
                  @click="handleViewInvoice(invoice.id)"
                  class="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                  type="button"
                >
                  <Icon icon="mdi:eye" class="w-5 h-5" />
                </button>
              </Tooltip>

              <Tooltip v-if="canShowRestore(invoice)" text="Refund Invoice">
                <button
                  @click="handleCancel(invoice)"
                  :disabled="isCancelDisabled(invoice)"
                  class="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-red-600 disabled:hover:bg-transparent"
                  type="button"
                >
                  <Icon icon="mdi:restore" class="w-5 h-5" />
                </button>
              </Tooltip>

              <Tooltip v-if="canShowTrash(invoice)" text="Cancel Invoice">
                <button
                  @click="handleCancel(invoice)"
                  :disabled="isCancelDisabled(invoice)"
                  class="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-red-600 disabled:hover:bg-transparent"
                  type="button"
                >
                  <Icon icon="mdi:delete" class="w-5 h-5" />
                </button>
              </Tooltip>
            </div>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-gray-100 text-right w-auto">
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

    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
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

<script setup>
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import EntityTable from '../../components/EntityTable.vue'
import Pagination from '@/components/Pagination.vue'
import Tooltip from '@/components/Tooltip.vue'
import CreateInvoice from './Create.vue'
import { useInvoicesIndex } from './index/useInvoicesIndex'
import { invoiceColumns as columns } from './index/columns'

const emit = defineEmits(['cancel', 'loading'])
const vm = useInvoicesIndex(emit) // vm short for "view model"

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
</script>
