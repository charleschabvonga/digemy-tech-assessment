<template>
  <table :class="tableClass">
    <caption :class="srOnlyClass">{{ title }} — {{ description }}</caption>

    <thead :class="theadClass">
      <tr>
        <th :colspan="Math.max(columnCount, 1)" :class="headerCellClass">
          <div :class="headerContainerClass">
            <div :class="headerLeftClass">
              <div :class="headerTitleRowClass">
                <Icon :icon="icon" :class="headerIconClass" />
                <h2 :class="headerTitleClass">
                  {{ title }}
                </h2>
              </div>
              <p v-if="description" :class="descriptionClass">
                {{ description }}
              </p>
            </div>

            <slot name="header-action">
              <button
                v-if="actionButton && actionButton.show !== false"
                type="button"
                :class="actionButtonClass"
                @click="emit('action-click')"
              >
                <Icon
                  v-if="actionButton.icon"
                  :icon="actionButton.icon"
                  :class="actionButtonIconClass"
                />
                {{ actionButton.label }}
              </button>
            </slot>
          </div>
        </th>
      </tr>

      <tr v-if="columns.length">
        <th
          v-for="column in columns"
          :key="column.key || column.label"
          scope="col"
          :class="columnHeaderClass(column)"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>

    <tbody :class="tbodyClass">
      <template v-if="!data.length">
        <tr>
          <td :colspan="Math.max(columnCount, 1)" :class="emptyCellClass">
            <Icon :icon="emptyStateIcon" :class="emptyIconClass" />
            <p :class="emptyTextClass">{{ emptyStateMessage }}</p>
          </td>
        </tr>
      </template>

      <template v-else>
        <tr
          v-for="(row, index) in data"
          :key="getRowKey(row, index)"
          :class="rowClass"
        >
          <slot :row="row" :index="index" />
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { css } from '../../../styled-system/css'

interface EntityTableColumn {
  label: string
  key?: string
}

interface ActionButtonConfig {
  label: string
  icon?: string
  show?: boolean
}

type RowKeyProp = string | ((row: any, index: number) => string | number)

interface EntityTableProps {
  title: string
  icon: string
  description?: string
  columns?: EntityTableColumn[]
  data?: any[]
  actionButton?: ActionButtonConfig | null
  emptyStateIcon?: string
  emptyStateMessage?: string
  rowKey?: RowKeyProp
}

const props = withDefaults(defineProps<EntityTableProps>(), {
  description: '',
  columns: () => [],
  data: () => [],
  actionButton: null,
  emptyStateIcon: 'mdi:file-document-outline',
  emptyStateMessage: 'No items found',
  rowKey: 'id',
})

const emit = defineEmits<{
  (e: 'action-click'): void
}>()

const columnCount = computed(() => props.columns.length)

const getRowKey = (row: any, index: number) =>
  typeof props.rowKey === 'function'
    ? props.rowKey(row, index)
    : row?.[props.rowKey] ?? index

const tableClass = css({
  width: '100%',
  minWidth: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0,
})

const srOnlyClass = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: 0,
})

const theadClass = css({
  backgroundColor: 'rgb(249, 250, 251)',
  borderBottomWidth: '1px',
  borderBottomColor: 'rgb(229, 231, 235)',
})

const headerCellClass = css({
  paddingInline: '1.5rem',
  paddingBlock: '1rem',
  borderBottomWidth: '1px',
  borderBottomColor: 'rgb(229, 231, 235)',
})

const headerContainerClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: '1rem',
})

const headerLeftClass = css({
  textAlign: 'left',
  flex: 1,
  minWidth: 0,
})

const headerTitleRowClass = css({
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
  fontSize: '1.25rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: 'rgb(37, 99, 235)',
  lineHeight: 1.25,
})

const descriptionClass = css({
  marginTop: '0.25rem',
  fontSize: '0.875rem',
  color: 'rgb(107, 114, 128)',
  fontWeight: 400,
})

const actionButtonClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  columnGap: '0.5rem',
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'white',
  backgroundColor: 'rgb(37, 99, 235)',
  borderRadius: '0.375rem',
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    backgroundColor: 'rgb(30, 64, 175)',
  },
})

const actionButtonIconClass = css({
  width: '1.25rem',
  height: '1.25rem',
})

const columnHeaderBaseClass = css({
  paddingInline: '1.5rem',
  paddingBlock: '0.75rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'rgb(107, 114, 128)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottomWidth: '1px',
  borderBottomColor: 'rgb(229, 231, 235)',
})

const columnHeaderLeftClass = css({
  textAlign: 'left',
})

const columnHeaderRightClass = css({
  textAlign: 'right',
  backgroundColor: 'rgb(243, 244, 246)',
  whiteSpace: 'nowrap',
})

function columnHeaderClass(column: EntityTableColumn) {
  const isId =
    column.key === 'id' || column.label === 'ID'
  return [
    columnHeaderBaseClass,
    isId ? columnHeaderRightClass : columnHeaderLeftClass,
  ]
}

const tbodyClass = css({
  backgroundColor: 'white',
})

const emptyCellClass = css({
  paddingInline: '1.5rem',
  paddingBlock: '2rem',
  textAlign: 'center',
  color: 'rgb(107, 114, 128)',
})

const emptyIconClass = css({
  width: '3rem',
  height: '3rem',
  color: 'rgb(156, 163, 175)',
  marginInline: 'auto',
  marginBottom: '0.75rem',
})

const emptyTextClass = css({
  fontSize: '0.875rem',
})

const rowClass = css({
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    backgroundColor: 'rgb(249, 250, 251)',
  },
})
</script>