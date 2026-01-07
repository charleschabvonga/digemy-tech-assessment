<template>
  <div v-if="show" :class="backdropClass" @click.self="handleBackdropClick">
    <div :class="dialogClass">
      <div :class="bodyClass">
        <div :class="headerClass">
          <h3 :class="titleClass">
            <slot name="title">
              {{ title }}
            </slot>
          </h3>
          <button
            type="button"
            :disabled="disableClose"
            :class="closeButtonClass"
            @click="emitClose"
          >
            <Icon icon="mdi:close" :class="closeIconClass" />
          </button>
        </div>

        <div :class="contentClass">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { css } from '../../../styled-system/css'

interface FormModalProps {
  show?: boolean
  title?: string
  disableClose?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<FormModalProps>(), {
  show: false,
  title: '',
  disableClose: false,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const backdropClass = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(31, 41, 55, 0.6)',
  overflowY: 'auto',
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const dialogClass = css({
  position: 'relative',
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
  maxWidth: '42rem',
  width: '100%',
  marginInline: '1rem',
  maxHeight: '90vh',
  overflowY: 'auto',
})

const bodyClass = css({
  padding: '1.5rem',
})

const headerClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
})

const titleClass = css({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'rgb(17, 24, 39)',
})

const closeButtonClass = css({
  color: 'rgb(156, 163, 175)',
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  transitionProperty: 'color',
  transitionDuration: '150ms',
  _hover: {
    color: 'rgb(75, 85, 99)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const closeIconClass = css({
  width: '1.25rem',
  height: '1.25rem',
})

const contentClass = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: '1rem',
})

function emitClose() {
  if (!props.disableClose) {
    emit('close')
  }
}

function handleBackdropClick() {
  if (props.closeOnBackdrop && !props.disableClose) {
    emit('close')
  }
}
</script>