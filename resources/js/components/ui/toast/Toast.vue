<template>
  <Transition
    appear
    enter-active-class="toast-enter-active"
    enter-from-class="toast-enter-from"
    enter-to-class="toast-enter-to"
    leave-active-class="toast-leave-active"
    leave-from-class="toast-leave-from"
    leave-to-class="toast-leave-to"
  >
    <div
      v-if="visible"
      :class="[toastClass, variant === 'destructive' ? toastDestructiveClass : toastDefaultClass]"
    >
      <div :class="contentWrapperClass">
        <Icon
          :icon="variant === 'destructive' ? 'mdi:alert-circle' : 'mdi:check-circle'"
          :class="variant === 'destructive' ? iconDestructiveClass : iconSuccessClass"
        />
        <div :class="textWrapperClass">
          <div v-if="title" :class="titleClass">
            {{ title }}
          </div>
          <div
            v-if="description"
            :class="[descriptionBaseClass, variant === 'destructive' ? descriptionDestructiveClass : descriptionDefaultClass]"
          >
            {{ description }}
          </div>
        </div>
      </div>
      <div :class="actionsWrapperClass">
        <button
          v-if="action"
          type="button"
          @click="action.onClick"
          :class="variant === 'destructive' ? actionDestructiveClass : actionDefaultClass"
        >
          {{ action.label }}
        </button>
        <button
          type="button"
          :class="closeButtonClass"
          @click="handleDismiss"
        >
          <Icon icon="mdi:close" :class="closeIconClass" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { css } from '../../../../../styled-system/css'
import { useToast } from './use-toast.js'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
    title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  action: {
    type: Object,
    default: null,
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'destructive'].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const { dismiss } = useToast()
const visible = ref(true)

function handleDismiss() {
  visible.value = false
  setTimeout(() => {
    dismiss(props.id)
  }, 150)
}

onMounted(() => {
  const duration = props.duration || 3000
  if (duration > 0) {
    setTimeout(() => {
      handleDismiss()
    }, duration)
  }
})

const toastClass = css({
  pointerEvents: 'auto',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: '1rem',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '0.375rem',
  borderWidth: '1px',
  paddingInline: '1.5rem',
  paddingBlock: '1.5rem',
  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
  transitionProperty: 'opacity, transform',
  transitionDuration: '200ms',
})

const toastDefaultClass = css({
  borderColor: 'rgb(229, 231, 235)',
  backgroundColor: 'white',
  color: 'rgb(12, 10, 9)',
})

const toastDestructiveClass = css({
  borderColor: 'rgb(239, 68, 68)',
  backgroundColor: 'rgb(254, 242, 242)',
  color: 'rgb(127, 29, 29)',
})

const contentWrapperClass = css({
  display: 'flex',
  alignItems: 'flex-start',
  columnGap: '0.75rem',
})

const iconBaseClass = css({
  flexShrink: 0,
  marginTop: '0.125rem',
  width: '1.25rem',
  height: '1.25rem',
})

const iconSuccessClass = css({
  ...iconBaseClass,
  color: 'rgb(22, 163, 74)',
})

const iconDestructiveClass = css({
  ...iconBaseClass,
  color: 'rgb(220, 38, 38)',
})

const textWrapperClass = css({
  display: 'grid',
  rowGap: '0.25rem',
  flex: 1,
})

const titleClass = css({
  fontSize: '0.875rem',
  fontWeight: 600,
})

const descriptionBaseClass = css({
  fontSize: '0.875rem',
  opacity: 0.9,
})

const descriptionDefaultClass = css({
  color: 'rgb(107, 114, 128)',
})

const descriptionDestructiveClass = css({
  color: 'rgb(153, 27, 27)',
})

const actionsWrapperClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.5rem',
})

const actionBaseClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '2rem',
  paddingInline: '0.75rem',
  borderRadius: '0.375rem',
  fontSize: '0.75rem',
  fontWeight: 500,
  borderWidth: '1px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  outline: 'none',
  transitionProperty: 'background-color, color, border-color',
  transitionDuration: '150ms',
})

const actionDefaultClass = css({
  ...actionBaseClass,
  borderColor: 'rgb(229, 231, 235)',
  color: 'rgb(17, 24, 39)',
  _hover: {
    backgroundColor: 'rgb(243, 244, 246)',
  },
})

const actionDestructiveClass = css({
  ...actionBaseClass,
  borderColor: 'rgb(239, 68, 68)',
  color: 'rgb(127, 29, 29)',
  _hover: {
    backgroundColor: 'rgb(254, 226, 226)',
  },
})

const closeButtonClass = css({
  position: 'absolute',
  insetBlockStart: '0.5rem',
  insetInlineEnd: '0.5rem',
  padding: '0.25rem',
  borderRadius: '0.375rem',
  border: 'none',
  cursor: 'pointer',
  color: 'rgba(12, 10, 9, 0.5)',
  backgroundColor: 'transparent',
  transitionProperty: 'color, opacity',
  transitionDuration: '150ms',
  _hover: {
    color: 'rgb(12, 10, 9)',
    opacity: 1,
  },
})

const closeIconClass = css({
  width: '1rem',
  height: '1rem',
})
</script>