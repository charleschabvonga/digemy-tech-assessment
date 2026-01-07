<template>
  <div v-if="show" :class="backdropClass">
    <div :class="dialogClass">
      <div :class="bodyClass">
        <div :class="iconWrapperClass">
          <Icon icon="mdi:alert-circle" :class="iconClass" />
        </div>
        <h3 :class="titleClass">{{ title }}</h3>
        <p :class="messageClass">{{ message }}</p>
        <div :class="actionsClass">
          <button
            type="button"
            :class="cancelButtonClass"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="loading"
            :class="confirmButtonClass"
            @click="emit('confirm')"
          >
            <Icon
              v-if="loading"
              icon="mdi:loading"
              :class="loadingIconClass"
            />
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { css } from '../../../styled-system/css'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

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
  maxWidth: '28rem',
  width: '100%',
  marginInline: '1rem',
})

const bodyClass = css({
  padding: '1.5rem',
})

const iconWrapperClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  marginInline: 'auto',
  marginBottom: '1rem',
  borderRadius: '9999px',
  backgroundColor: 'rgb(254, 226, 226)',
})

const iconClass = css({
  width: '1.5rem',
  height: '1.5rem',
  color: 'rgb(220, 38, 38)',
})

const titleClass = css({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'rgb(17, 24, 39)',
  textAlign: 'center',
  marginBottom: '0.5rem',
})

const messageClass = css({
  fontSize: '0.875rem',
  color: 'rgb(75, 85, 99)',
  textAlign: 'center',
  marginBottom: '1.5rem',
})

const actionsClass = css({
  display: 'flex',
  justifyContent: 'center',
  columnGap: '0.75rem',
})

const cancelButtonClass = css({
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgb(55, 65, 81)',
  backgroundColor: 'rgb(243, 244, 246)',
  borderRadius: '0.375rem',
  border: 'none',
  cursor: 'pointer',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    backgroundColor: 'rgb(229, 231, 235)',
  },
})

const confirmButtonClass = css({
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'white',
  backgroundColor: 'rgb(220, 38, 38)',
  borderRadius: '0.375rem',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  columnGap: '0.5rem',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    backgroundColor: 'rgb(185, 28, 28)',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const loadingIconClass = css({
  width: '1rem',
  height: '1rem',
  animation: 'spin 1s linear infinite',
})
</script>