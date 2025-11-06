<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="relative flex items-center justify-center w-16 h-16">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <Icon icon="mdi:file-document" class="h-8 w-8 text-blue-600 relative z-10" />
      </div>
      <p class="text-sm font-medium text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'Loading',
  components: {
    Icon
  },
  props: {
    message: {
      type: String,
      default: 'Loading...'
    }
  }
};
</script>

