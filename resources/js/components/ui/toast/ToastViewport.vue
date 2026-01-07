<template>
  <div :class="viewportClass">
    <slot />
  </div>
</template>

<script setup>
import { css } from '../../../../../styled-system/css'

const viewportClass = css({
  position: 'fixed',
  insetBlockStart: '1rem',
  insetInlineEnd: '1rem',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  rowGap: '0.5rem',
  maxHeight: '100vh',
  width: '100%',
  padding: 0,
  '@media (min-width: 768px)': {
    maxWidth: '26.25rem',
  },
})
</script>