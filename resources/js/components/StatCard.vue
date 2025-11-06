<template>
  <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
    <div class="flex items-center justify-between mb-2">
      <p class="text-sm text-gray-500">{{ label }}</p>
      <Icon v-if="icon" :icon="icon" :class="iconClass" class="w-6 h-6" />
    </div>
    <slot name="value">
      <p :class="valueClass" class="text-xl font-bold">{{ value }}</p>
    </slot>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'StatCard',
  components: { Icon },
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    valueColor: {
      type: String,
      default: 'gray',
      validator: (value) => ['gray', 'green', 'red', 'blue', 'yellow', 'indigo'].includes(value)
    }
  },
  computed: {
    valueClass() {
      const classes = {
        gray: 'text-gray-900',
        green: 'text-green-600',
        red: 'text-red-600',
        blue: 'text-blue-600',
        yellow: 'text-yellow-600',
        indigo: 'text-indigo-600'
      }
      return classes[this.valueColor] || classes.gray
    },
    iconClass() {
      const classes = {
        gray: 'text-gray-600',
        green: 'text-green-600',
        red: 'text-red-600',
        blue: 'text-blue-600',
        yellow: 'text-yellow-600',
        indigo: 'text-indigo-600'
      }
      return classes[this.valueColor] || classes.gray
    }
  }
}
</script>

