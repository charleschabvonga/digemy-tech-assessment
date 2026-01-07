<template>
  <div :class="cardClass">
    <div :class="headerClass">
      <p :class="labelClass">{{ label }}</p>
      <Icon v-if="icon" :icon="icon" :class="iconClass" />
    </div>
    <slot name="value">
      <p :class="valueClass">{{ value }}</p>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { css, cva } from '../../../styled-system/css'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  valueColor: {
    type: String,
    default: 'gray',
    validator: value =>
      ['gray', 'green', 'red', 'blue', 'yellow', 'indigo'].includes(value),
  },
})

const cardClass = css({
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  paddingInline: '1.5rem',
  paddingBlock: '1.5rem',
  borderWidth: '1px',
  borderColor: 'rgb(229, 231, 235)',
})

const headerClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.5rem',
})

const labelClass = css({
  fontSize: '0.875rem',
  color: 'rgb(107, 114, 128)',
})

const iconBaseClass = css({
  width: '1.5rem',
  height: '1.5rem',
})

const valueTextStyle = cva({
  base: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  variants: {
    color: {
      gray: { color: 'rgb(17, 24, 39)' },
      green: { color: 'rgb(22, 163, 74)' },
      red: { color: 'rgb(220, 38, 38)' },
      blue: { color: 'rgb(37, 99, 235)' },
      yellow: { color: 'rgb(234, 179, 8)' },
      indigo: { color: 'rgb(79, 70, 229)' },
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

const iconColorStyle = cva({
  variants: {
    color: {
      gray: { color: 'rgb(75, 85, 99)' },
      green: { color: 'rgb(22, 163, 74)' },
      red: { color: 'rgb(220, 38, 38)' },
      blue: { color: 'rgb(37, 99, 235)' },
      yellow: { color: 'rgb(234, 179, 8)' },
      indigo: { color: 'rgb(79, 70, 229)' },
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

const valueClass = computed(() =>
  valueTextStyle({ color: props.valueColor }),
)

const iconClass = computed(() => [
  iconBaseClass,
  iconColorStyle({ color: props.valueColor }),
])
</script>