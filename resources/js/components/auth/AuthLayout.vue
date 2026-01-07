<template>
  <div :class="containerClass">
    <div :class="cardWrapperClass">
      <div :class="iconWrapperOuterClass">
        <div :class="iconWrapperInnerClass">
          <Icon :icon="icon" :class="iconClass" />
          <div :class="iconOverlayClass"></div>
        </div>
      </div>
      <div :class="cardClass">
        <div :class="logoWrapperClass">
          <Logo :class="logoClass" />
        </div>
        <div :class="headerClass">
          <h2 :class="titleClass">{{ title }}</h2>
          <p :class="subtitleClass">{{ subtitle }}</p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Logo from '@/components/Logo.vue'
import { css } from '../../../../styled-system/css'

interface AuthLayoutProps {
  icon: string
  title: string
  subtitle: string
}

defineProps<AuthLayoutProps>()

const containerClass = css({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgb(243, 244, 246)',
  paddingBlock: '3rem',
  paddingInline: '1rem',
  '@media (min-width: 640px)': {
    paddingInline: '1.5rem',
  },
  '@media (min-width: 1024px)': {
    paddingInline: '2rem',
  },
})

const cardWrapperClass = css({
  maxWidth: '28rem',
  width: '100%',
  position: 'relative',
})

const iconWrapperOuterClass = css({
  position: 'absolute',
  top: '-2.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
})

const iconWrapperInnerClass = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  borderRadius: '0.75rem',
  backgroundColor: 'rgb(37, 99, 235)',
  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
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
  backgroundImage: 'linear-gradient(to right, transparent, transparent, rgba(30, 64, 175, 0.9))',
  pointerEvents: 'none',
})

const cardClass = css({
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
  paddingInline: '2rem',
  paddingTop: '3rem',
  paddingBottom: '3rem',
})

const logoWrapperClass = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '1.5rem',
})

const logoClass = css({
  marginBottom: '1rem',
})

const headerClass = css({
  textAlign: 'center',
  marginBottom: '1.5rem',
})

const titleClass = css({
  fontSize: '1.875rem',
  lineHeight: 1.2,
  fontWeight: 700,
  color: 'rgb(15, 23, 42)',
})

const subtitleClass = css({
  marginTop: '0.5rem',
  fontSize: '0.875rem',
  color: 'rgb(75, 85, 99)',
})
</script>

