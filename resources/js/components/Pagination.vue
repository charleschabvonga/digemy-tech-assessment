<template>
  <div v-if="pagination" :class="[containerClass, showBorderTop ? containerBorderClass : null]">
    <div :class="innerClass">
      <div :class="leftSectionClass">
        <div :class="summaryTextClass">
          Showing
          <span :class="summaryHighlightClass">{{ pagination.from || 0 }}</span>
          to
          <span :class="summaryHighlightClass">{{ pagination.to || 0 }}</span>
          of
          <span :class="summaryHighlightClass">{{ pagination.total || 0 }}</span>
          results
        </div>

        <div :class="perPageWrapperClass">
          <label for="perPage" :class="summaryTextClass">Per page:</label>
          <select
            id="perPage"
            :value="perPage"
            @change="handlePerPageChange"
            :disabled="loading"
            :class="perPageSelectClass"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div v-if="pagination.last_page > 1" :class="rightSectionClass">
        <button
          @click="handleGoToPage(1)"
          :disabled="pagination.current_page === 1 || loading"
          :class="navButtonClass"
          title="First page"
          type="button"
        >
          <Icon icon="mdi:page-first" :class="navIconClass" />
        </button>

        <button
          @click="handleGoToPage(pagination.current_page - 1)"
          :disabled="!pagination.prev_page_url || loading"
          :class="navButtonClass"
          type="button"
        >
          Previous
        </button>

        <div :class="pageWrapperClass">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="handleGoToPage(page)"
            :disabled="loading || page === pagination.current_page"
            :class="page === pagination.current_page ? pageActiveClass : pageButtonClass"
            type="button"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="handleGoToPage(pagination.current_page + 1)"
          :disabled="!pagination.next_page_url || loading"
          :class="navButtonClass"
          type="button"
        >
          Next
        </button>

        <button
          @click="handleGoToPage(pagination.last_page)"
          :disabled="pagination.current_page === pagination.last_page || loading"
          :class="navButtonClass"
          title="Last page"
          type="button"
        >
          <Icon icon="mdi:page-last" :class="navIconClass" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { css } from '../../../styled-system/css'

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

const containerClass = css({
  paddingInline: '1.5rem',
  paddingBlock: '0.75rem',
  backgroundColor: 'white',
})

const containerBorderClass = css({
  borderTopWidth: '1px',
  borderTopColor: 'rgb(229, 231, 235)',
})

const innerClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '0.75rem',
})

const leftSectionClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.75rem',
})

const summaryTextClass = css({
  fontSize: '0.75rem',
  color: 'rgb(55, 65, 81)',
})

const summaryHighlightClass = css({
  fontWeight: 500,
})

const perPageWrapperClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.5rem',
})

const perPageSelectClass = css({
  paddingInline: '0.5rem',
  paddingBlock: '0.25rem',
  fontSize: '0.75rem',
  borderWidth: '1px',
  borderColor: 'rgb(209, 213, 219)',
  borderRadius: '0.375rem',
  backgroundColor: 'white',
  outline: 'none',
  _focus: {
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const rightSectionClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.25rem',
})

const pageWrapperClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.25rem',
})

const navButtonBaseClass = css({
  paddingInline: '0.5rem',
  paddingBlock: '0.25rem',
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'rgb(55, 65, 81)',
  backgroundColor: 'white',
  borderWidth: '1px',
  borderColor: 'rgb(209, 213, 219)',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  display: 'inline-flex',
  alignItems: 'center',
  columnGap: '0.25rem',
  _hover: {
    backgroundColor: 'rgb(249, 250, 251)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const navButtonClass = navButtonBaseClass

const navIconClass = css({
  width: '1rem',
  height: '1rem',
})

const pageButtonBaseClass = css({
  paddingInline: '0.5rem',
  paddingBlock: '0.25rem',
  fontSize: '0.75rem',
  fontWeight: 500,
  borderRadius: '0.375rem',
  cursor: 'pointer',
})

const pageButtonClass = css({
  ...pageButtonBaseClass,
  color: 'rgb(55, 65, 81)',
  backgroundColor: 'white',
  borderWidth: '1px',
  borderColor: 'rgb(209, 213, 219)',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    backgroundColor: 'rgb(249, 250, 251)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const pageActiveClass = css({
  ...pageButtonBaseClass,
  backgroundColor: 'rgb(37, 99, 235)',
  color: 'white',
})

function handleGoToPage(page) {
  emit('page-change', page)
}

function handlePerPageChange(event) {
  const newPerPage = parseInt(event.target.value)
  emit('per-page-change', newPerPage)
}
</script>

