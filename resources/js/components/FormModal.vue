<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center" @click.self="handleBackdropClick">
    <div class="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            <slot name="title">
              {{ title }}
            </slot>
          </h3>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
            :disabled="disableClose"
          >
            <Icon icon="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'FormModal',
  components: {
    Icon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    disableClose: {
      type: Boolean,
      default: false
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    function handleBackdropClick() {
      if (props.closeOnBackdrop && !props.disableClose) {
        emit('close')
      }
    }

    return {
      handleBackdropClick
    }
  }
}
</script>

