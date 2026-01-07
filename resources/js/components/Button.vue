<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClass"
    @click="handleClick"
  >
    <Icon
      v-if="loading"
      icon="mdi:loading"
      :class="loadingIconClass"
    />
    <Icon
      v-else-if="icon"
      :icon="icon"
      :class="iconClass"
    />
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { cva, css } from '../../../styled-system/css'

type ButtonVariant = 'primary' | 'primary-green' | 'secondary'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  icon?: string
  loading?: boolean
  disabled?: boolean
  text?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  icon: '',
  loading: false,
  disabled: false,
  text: '',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    borderRadius: '0.375rem',
    transitionProperty: 'background-color, color, border-color, box-shadow',
    transitionDuration: '150ms',
  },
  variants: {
    variant: {
      primary: {
        color: 'white',
        backgroundColor: 'rgb(37, 99, 235)',
        _hover: {
          backgroundColor: 'rgb(30, 64, 175)',
        },
      },
      'primary-green': {
        color: 'white',
        backgroundColor: 'rgb(22, 163, 74)',
        _hover: {
          backgroundColor: 'rgb(21, 128, 61)',
        },
      },
      secondary: {
        color: 'rgb(55, 65, 81)',
        backgroundColor: 'rgb(229, 231, 235)',
        _hover: {
          backgroundColor: 'rgb(209, 213, 219)',
        },
      },
    },
    state: {
      default: {},
      disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    state: 'default',
  },
})

const iconClass = css({
  width: '1rem',
  height: '1rem',
})

const loadingIconClass = css({
  width: '1rem',
  height: '1rem',
  animation: 'spin 1s linear infinite',
})

const buttonClass = computed(() =>
  buttonStyle({
    variant: props.variant,
    state: props.disabled || props.loading ? 'disabled' : 'default',
  }),
)

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

