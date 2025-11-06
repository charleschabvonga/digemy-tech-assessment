<template>
  <div v-if="pagination" :class="['px-6 py-3 bg-white', showBorderTop ? 'border-t border-gray-200' : '']">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <div class="text-xs text-gray-700">
          Showing
          <span class="font-medium">{{ pagination.from || 0 }}</span>
          to
          <span class="font-medium">{{ pagination.to || 0 }}</span>
          of
          <span class="font-medium">{{ pagination.total || 0 }}</span>
          results
        </div>

        <div class="flex items-center gap-2">
          <label for="perPage" class="text-xs text-gray-700">Per page:</label>
          <select
            id="perPage"
            :value="perPage"
            @change="handlePerPageChange"
            :disabled="loading"
            class="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div v-if="pagination.last_page > 1" class="flex items-center gap-1">
        <button
          @click="handleGoToPage(1)"
          :disabled="pagination.current_page === 1 || loading"
          class="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="First page"
          type="button"
        >
          <Icon icon="mdi:page-first" class="w-4 h-4" />
        </button>

        <button
          @click="handleGoToPage(pagination.current_page - 1)"
          :disabled="!pagination.prev_page_url || loading"
          class="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          Previous
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="handleGoToPage(page)"
            :disabled="loading || page === pagination.current_page"
            :class="[
              'px-2 py-1 text-xs font-medium rounded-md',
              page === pagination.current_page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            ]"
            type="button"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="handleGoToPage(pagination.current_page + 1)"
          :disabled="!pagination.next_page_url || loading"
          class="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          Next
        </button>

        <button
          @click="handleGoToPage(pagination.last_page)"
          :disabled="pagination.current_page === pagination.last_page || loading"
          class="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Last page"
          type="button"
        >
          <Icon icon="mdi:page-last" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  pagination: {
    type: Object,
    default: null
  },
  perPage: {
    type: Number,
    required: true
  },
  visiblePages: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showBorderTop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['page-change', 'per-page-change'])

function handleGoToPage(page) {
  emit('page-change', page)
}

function handlePerPageChange(event) {
  const newPerPage = parseInt(event.target.value)
  emit('per-page-change', newPerPage)
}
</script>

