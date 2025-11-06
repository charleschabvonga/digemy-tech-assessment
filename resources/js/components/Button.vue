<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
      variant === 'primary' 
        ? 'text-white bg-blue-600 hover:bg-blue-700'
        : variant === 'primary-green'
        ? 'text-white bg-green-600 hover:bg-green-700'
        : 'text-gray-700 bg-gray-200 hover:bg-gray-300',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    @click="$emit('click', $event)"
  >
    <Icon 
      v-if="loading" 
      icon="mdi:loading" 
      class="w-4 h-4 animate-spin" 
    />
    <Icon 
      v-else-if="icon" 
      :icon="icon" 
      class="w-4 h-4" 
    />
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'Button',
  components: { Icon },
  props: {
    type: {
      type: String,
      default: 'button'
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'primary-green', 'secondary'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

