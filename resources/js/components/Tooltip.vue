<template>
  <div class="relative inline-block group">
    <slot></slot>
    <div
      v-if="text || $slots.tooltip"
      :class="[
        'absolute px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-10',
        positionClasses,
        multiLine ? 'break-words whitespace-normal max-w-xs' : 'whitespace-nowrap'
      ]"
    >
      <slot name="tooltip">{{ text }}</slot>
      <div
        :class="[
          'absolute border-4 border-transparent',
          arrowClasses
        ]"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right', 'top-left'].includes(value)
  },
  multiLine: {
    type: Boolean,
    default: false
  }
})

const positionClasses = computed(() => {
  const classes = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    'top-left': 'bottom-full left-0 mb-2'
  }
  return classes[props.position] || classes.top
})

const arrowClasses = computed(() => {
  const classes = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1 border-r-gray-900',
    'top-left': 'top-full left-4 -mt-1 border-t-gray-900'
  }
  return classes[props.position] || classes.top
})
</script>
