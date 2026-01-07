<template>
  <div :class="containerClass">
    <div :class="iconWrapperClass">
      <Icon icon="mdi:file-document" :class="iconClass" />
      <div :class="iconOverlayClass"></div>
    </div>
    <span :class="textClass">InvoiceHub</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { css } from '../../../styled-system/css'

const containerClass = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

const iconWrapperClass = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  borderRadius: '0.75rem',
  backgroundColor: 'rgb(37, 99, 235)',
  overflow: 'hidden',
})

const iconClass = css({
  width: '1.75rem',
  height: '1.75rem',
  color: 'white',
  position: 'relative',
  zIndex: 10,
})

const iconOverlayClass = css({
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'linear-gradient(to right, transparent, transparent, rgba(30, 64, 175, 0.9))',
  pointerEvents: 'none',
})

const textClass = css({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'rgb(15, 23, 42)',
})
</script>