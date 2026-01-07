<template>
  <div :class="backdropClass">
    <div :class="contentClass">
      <div :class="spinnerWrapperClass">
        <div :class="spinnerBackgroundClass">
          <div :class="spinnerRingClass"></div>
        </div>
        <Icon icon="mdi:file-document" :class="iconClass" />
      </div>
      <p :class="messageClass">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { css } from '../../../styled-system/css'

const props = defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
})

const backdropClass = css({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(15, 23, 42, 0.08)',
  zIndex: 50,
})

const contentClass = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  rowGap: '1rem',
})

const spinnerWrapperClass = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '4rem',
  height: '4rem',
})

const spinnerBackgroundClass = css({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const spinnerRingClass = css({
  width: '4rem',
  height: '4rem',
  borderWidth: '0.25rem',
  borderColor: 'rgb(191, 219, 254)',
  borderTopColor: 'rgb(37, 99, 235)',
  borderRadius: '9999px',
  animation: 'spin 1s linear infinite',
})

const iconClass = css({
  width: '2rem',
  height: '2rem',
  color: 'rgb(37, 99, 235)',
  position: 'relative',
  zIndex: 10,
})

const messageClass = css({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgb(75, 85, 99)',
})
</script>

