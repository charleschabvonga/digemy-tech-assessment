<template>
  <ToastProvider>
    <ToastViewport>
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        v-bind="toast"
      />
    </ToastViewport>
  </ToastProvider>
</template>

<script setup lang="ts">
import { useToast } from './use-toast'
import Toast from './Toast.vue'
import ToastProvider from './ToastProvider.vue'
import ToastViewport from './ToastViewport.vue'

const { toasts } = useToast()
</script>

