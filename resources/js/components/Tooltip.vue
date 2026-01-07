<template>
  <div
    :class="wrapperClass"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <slot></slot>
    <div
      v-if="(text || $slots.tooltip) && isHovered"
      :class="tooltipBoxClass"
    >
      <slot name="tooltip">{{ text }}</slot>
      <div :class="arrowClass"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { css } from '../../../styled-system/css'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: 'top',
    validator: value =>
      ['top', 'bottom', 'left', 'right', 'top-left'].includes(value),
  },
  multiLine: {
    type: Boolean,
    default: false,
  },
})

const isHovered = ref(false)

const wrapperClass = css({
  position: 'relative',
  display: 'inline-block',
})

const tooltipBase = {
  position: 'absolute',
  paddingInline: '0.75rem',
  paddingBlock: '0.5rem',
  backgroundColor: 'rgb(17, 24, 39)',
  color: 'white',
  fontSize: '0.75rem',
  borderRadius: '0.5rem',
  zIndex: 10,
  transitionProperty: 'opacity',
  transitionDuration: '200ms',
}

const tooltipPositions = {
  top: {
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '0.5rem',
  },
  bottom: {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '0.5rem',
  },
  left: {
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginRight: '0.5rem',
  },
  right: {
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: '0.5rem',
  },
  'top-left': {
    bottom: '100%',
    left: 0,
    marginBottom: '0.5rem',
  },
}

const arrowBase = {
  position: 'absolute',
  borderWidth: '0.25rem',
  borderColor: 'transparent',
}

const arrowPositions = {
  top: {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '-0.25rem',
    borderTopColor: 'rgb(17, 24, 39)',
  },
  bottom: {
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '-0.25rem',
    borderBottomColor: 'rgb(17, 24, 39)',
  },
  left: {
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: '-0.25rem',
    borderLeftColor: 'rgb(17, 24, 39)',
  },
  right: {
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginRight: '-0.25rem',
    borderRightColor: 'rgb(17, 24, 39)',
  },
  'top-left': {
    top: '100%',
    left: '1rem',
    marginTop: '-0.25rem',
    borderTopColor: 'rgb(17, 24, 39)',
  },
}

const tooltipBoxClass = computed(() =>
  css({
    ...tooltipBase,
    ...(tooltipPositions[props.position] || tooltipPositions.top),
    ...(props.multiLine
      ? {
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          maxWidth: '16rem',
        }
      : {
          whiteSpace: 'nowrap',
        }),
  }),
)

const arrowClass = computed(() =>
  css({
    ...arrowBase,
    ...(arrowPositions[props.position] || arrowPositions.top),
  }),
)
</script>
