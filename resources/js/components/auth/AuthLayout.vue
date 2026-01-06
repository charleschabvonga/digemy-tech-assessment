<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full relative">
      <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div class="relative flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg shadow-lg overflow-hidden">
          <Icon :icon="icon" class="w-7 h-7 text-white relative z-10" />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-800 pointer-events-none"></div>
        </div>
      </div>
      <div class="bg-white shadow-md rounded-lg p-8 pt-12 pb-12">
        <div class="flex flex-col items-center mb-6">
          <Logo class="mb-4" />
        </div>
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-gray-900">{{ title }}</h2>
          <p class="mt-2 text-sm text-gray-600">{{ subtitle }}</p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Logo from '@/components/Logo.vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>


