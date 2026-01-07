<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClass"
    :aria-label="ariaLabel"
    :title="title || label"
    @click="handleClick"
  >
    <span :class="labelClass">{{ label }}</span>
    <div :class="iconWrapperClass">
      <Icon
        v-if="loading"
        icon="mdi:loading"
        :class="loadingIconClass"
        aria-hidden="true"
      />
      <Icon
        v-else
        :icon="icon"
        :class="iconClass"
        aria-hidden="true"
      />
    </div>
    <div :class="overlayClass"></div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { cva, css } from '../../../styled-system/css'

type ActionButtonVariant = 'gray' | 'blue'

interface ActionButtonProps {
  label: string
  icon: string
  type?: 'button' | 'submit' | 'reset'
  variant?: ActionButtonVariant
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  title?: string
}

const props = withDefaults(defineProps<ActionButtonProps>(), {
  type: 'button',
  variant: 'gray',
  disabled: false,
  loading: false,
  ariaLabel: '',
  title: '',
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
    borderRadius: '9999px',
    position: 'relative',
    overflow: 'hidden',
    transitionProperty: 'background-color, color, border-color, box-shadow',
    transitionDuration: '150ms',
  },
  variants: {
    variant: {
      blue: {
        backgroundColor: 'rgb(96, 165, 250)',
        _hover: {
          backgroundColor: 'rgb(59, 130, 246)',
        },
      },
      gray: {
        backgroundColor: 'rgb(243, 244, 246)',
        _hover: {
          backgroundColor: 'rgb(229, 231, 235)',
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
    variant: 'gray',
    state: 'default',
  },
})

const labelStyle = cva({
  base: {
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  variants: {
    variant: {
      blue: {
        color: 'white',
      },
      gray: {
        color: 'rgb(55, 65, 81)',
      },
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
})

const iconWrapperStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '9999px',
    transitionProperty: 'background-color, color, border-color, box-shadow',
    transitionDuration: '150ms',
  },
  variants: {
    variant: {
      blue: {
        backgroundColor: 'rgb(37, 99, 235)',
      },
      gray: {
        backgroundColor: 'rgb(209, 213, 219)',
      },
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
})

const baseIconClass = css({
  width: '0.875rem',
  height: '0.875rem',
})

const blueIconClass = css({
  color: 'white',
})

const grayIconClass = css({
  color: 'rgb(55, 65, 81)',
})

const loadingIconExtraClass = css({
  animation: 'spin 1s linear infinite',
})

const overlayBlueClass = css({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage: 'linear-gradient(to right, transparent, transparent, rgba(59, 130, 246, 0.4))',
})

const overlayGrayClass = css({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage: 'linear-gradient(to right, transparent, rgba(229, 231, 235, 0.6))',
})

const buttonClass = computed(() =>
  buttonStyle({
    variant: props.variant,
    state: props.disabled || props.loading ? 'disabled' : 'default',
  }),
)

const labelClass = computed(() =>
  labelStyle({
    variant: props.variant,
  }),
)

const iconWrapperClass = computed(() =>
  iconWrapperStyle({
    variant: props.variant,
  }),
)

const iconClass = computed(() => {
  if (props.variant === 'blue') {
    return [baseIconClass, blueIconClass]
  }
  return [baseIconClass, grayIconClass]
})

const loadingIconClass = computed(() => [iconClass.value, loadingIconExtraClass])

const overlayClass = computed(() =>
  props.variant === 'blue' ? overlayBlueClass : overlayGrayClass,
)

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

