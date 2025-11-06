<template>
  <Transition
    appear
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div
      v-if="visible"
      :class="[
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        variant === 'destructive'
          ? 'border-red-500 bg-red-50 text-red-900'
          : 'border-gray-200 bg-white text-gray-950'
      ]"
    >
      <div class="flex items-start gap-3">
        <Icon
          :icon="variant === 'destructive' ? 'mdi:alert-circle' : 'mdi:check-circle'"
          :class="[
            'flex-shrink-0 mt-0.5',
            variant === 'destructive' ? 'text-red-600' : 'text-green-600'
          ]"
          class="w-5 h-5"
        />
        <div class="grid gap-1 flex-1">
          <div v-if="title" class="text-sm font-semibold">
            {{ title }}
          </div>
          <div v-if="description" :class="[
            'text-sm opacity-90',
            variant === 'destructive' ? 'text-red-800' : 'text-gray-500'
          ]">
            {{ description }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="action"
          @click="action.onClick"
          :class="[
            'inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            variant === 'destructive'
              ? 'border-red-500 bg-transparent text-red-900 hover:bg-red-100 focus:ring-red-500'
              : 'border-gray-200 bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-950'
          ]"
        >
          {{ action.label }}
        </button>
        <button
          @click="dismiss"
          :class="[
            'absolute right-2 top-2 rounded-md p-1 text-gray-950/50 opacity-0 transition-opacity hover:text-gray-950 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
            variant === 'destructive' ? 'text-red-900/50 hover:text-red-900' : 'text-gray-950/50 hover:text-gray-950'
          ]"
        >
          <Icon icon="mdi:close" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useToast } from './use-toast.js';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  action: {
    type: Object,
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'destructive'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const { dismiss } = useToast();
const visible = ref(true);

onMounted(() => {
  const duration = props.duration || 3000;
  if (duration > 0) {
    setTimeout(() => {
      visible.value = false;
      setTimeout(() => {
        dismiss(props.id);
      }, 200);
    }, duration);
  }
});
</script>

