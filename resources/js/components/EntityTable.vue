<template>
  <table class="min-w-full divide-y divide-gray-200">
    <caption class="sr-only">{{ title }} — {{ description }}</caption>

    <thead class="bg-gray-50">
      <tr>
        <th :colspan="Math.max(columnCount, 1)" class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center gap-4">
            <div class="text-left flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <Icon :icon="icon" class="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 class="text-xl font-bold text-blue-600 uppercase text-left leading-tight">
                  {{ title }}
                </h2>
              </div>
              <p v-if="description" class="text-sm text-gray-500 mt-1 font-normal">
                {{ description }}
              </p>
            </div>

            <slot name="header-action">
              <button
                v-if="actionButton && actionButton.show !== false"
                @click="$emit('action-click')"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex-shrink-0"
              >
                <Icon v-if="actionButton.icon" :icon="actionButton.icon" class="w-5 h-5" />
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
          :class="[
            'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
            (column.key === 'id' || column.label === 'ID') ? 'text-right bg-gray-100 w-auto' : 'text-left'
          ]"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>

    <tbody class="bg-white divide-y divide-gray-200">
      <template v-if="!data.length">
        <tr>
          <td :colspan="Math.max(columnCount, 1)" class="px-6 py-8 text-center text-gray-500">
            <Icon :icon="emptyStateIcon" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-sm">{{ emptyStateMessage }}</p>
          </td>
        </tr>
      </template>

      <template v-else>
        <tr v-for="(row, index) in data" :key="getRowKey(row, index)" class="hover:bg-gray-50">
          <slot :row="row" :index="index" />
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

export default {
  name: 'EntityTable',
  components: { Icon },
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, default: '' },
    columns: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    actionButton: { type: Object, default: null },
    emptyStateIcon: { type: String, default: 'mdi:file-document-outline' },
    emptyStateMessage: { type: String, default: 'No items found' },
    rowKey: { type: [String, Function], default: 'id' },
  },
  emits: ['action-click'],
  setup(props) {
    const columnCount = computed(() => props.columns.length)
    const getRowKey = (row, index) =>
      typeof props.rowKey === 'function' ? props.rowKey(row, index) : (row?.[props.rowKey] ?? index)
    return { columnCount, getRowKey }
  },
}
</script>
