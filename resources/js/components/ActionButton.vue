<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors group relative overflow-hidden',
      variant === 'blue' 
        ? 'bg-blue-400 hover:bg-blue-500' 
        : 'bg-gray-100 hover:bg-gray-200',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    :aria-label="ariaLabel"
    :title="title || label"
    @click="handleClick"
  >
    <span :class="[
      'text-xs font-medium',
      variant === 'blue' ? 'text-white' : 'text-gray-700'
    ]">{{ label }}</span>
    <div :class="[
      'flex items-center justify-center w-6 h-6 rounded-full transition-colors',
      variant === 'blue'
        ? loading 
          ? 'bg-blue-600' 
          : 'bg-blue-600 group-hover:bg-blue-700'
        : loading 
          ? 'bg-gray-300' 
          : 'bg-gray-300 group-hover:bg-gray-400'
    ]">
      <Icon 
        v-if="loading" 
        icon="mdi:loading" 
        :class="[
          'w-3.5 h-3.5 animate-spin',
          variant === 'blue' ? 'text-white' : 'text-gray-700'
        ]"
        aria-hidden="true" 
      />
      <Icon 
        v-else 
        :icon="icon" 
        :class="[
          'w-3.5 h-3.5',
          variant === 'blue' ? 'text-white' : 'text-gray-700'
        ]"
        aria-hidden="true" 
      />
    </div>
    <div :class="[
      'absolute inset-0 bg-gradient-to-r from-transparent via-transparent pointer-events-none',
      variant === 'blue' ? 'to-blue-500' : 'to-gray-200'
    ]"></div>
  </button>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'gray',
    validator: (value) => ['gray', 'blue'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

function handleClick(event) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

