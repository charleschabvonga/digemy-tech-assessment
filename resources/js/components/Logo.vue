<template>
  <div class="flex items-center gap-2">
    <div class="relative flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg overflow-hidden">
      <Icon icon="mdi:file-document" class="w-7 h-7 text-white relative z-10" />
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-800 pointer-events-none"></div>
    </div>
    <span class="text-2xl font-bold text-gray-900">InvoiceHub</span>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

