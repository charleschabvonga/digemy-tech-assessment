<template>
  <nav
    v-show="isAuthenticated"
    :class="navClass"
    aria-label="Main navigation"
  >
    <div
      v-if="isLoading"
      :class="loadingBarWrapperClass"
      aria-live="polite"
    >
      <div :class="loadingBarClass"></div>
    </div>

    <div :class="innerContainerClass">
      <div :class="innerContentClass">
        <Logo />

        <div :class="rightSectionClass">
          <div v-if="user" :class="userChipClass">
            <div :class="userAvatarClass" aria-hidden="true">
              {{ userInitials }}
            </div>
            <span :class="userNameClass">{{ userDisplayName }}</span>
          </div>

          <ActionButton
            v-if="isAuthenticated"
            @click="$emit('logout')"
            label="Sign out"
            icon="mdi:logout"
            aria-label="Logout"
            title="Logout"
            :loading="isLoading"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { css } from '../../../styled-system/css'
import Logo from './Logo.vue'
import ActionButton from './ActionButton.vue'
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated } = useAuth()

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['logout'])

const navClass = css({
  position: 'fixed',
  insetBlockStart: 0,
  insetInline: 0,
  zIndex: 50,
  backgroundColor: 'white',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
  borderBottomWidth: '1px',
  borderBottomColor: 'rgb(229, 231, 235)',
})

const loadingBarWrapperClass = css({
  position: 'absolute',
  insetInline: 0,
  insetBlockEnd: 0,
  height: '0.25rem',
  backgroundColor: 'rgb(229, 231, 235)',
  overflow: 'hidden',
})

const loadingBarClass = css({
  height: '100%',
  backgroundColor: 'rgb(34, 197, 94)',
  animation: 'progress 1.5s ease-in-out infinite',
})

const innerContainerClass = css({
  maxWidth: '80rem',
  marginInline: 'auto',
  paddingInline: '1rem',
  '@media (min-width: 640px)': {
    paddingInline: '1.5rem',
  },
  '@media (min-width: 1024px)': {
    paddingInline: '2rem',
  },
})

const innerContentClass = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '4rem',
})

const rightSectionClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.75rem',
})

const userChipClass = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: '0.5rem',
  paddingInline: '0.5rem',
  paddingBlock: '0.25rem',
  backgroundColor: 'rgb(249, 250, 251)',
  borderWidth: '1px',
  borderColor: 'rgb(229, 231, 235)',
  borderRadius: '9999px',
})

const userAvatarClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '9999px',
  backgroundColor: 'rgb(37, 99, 235)',
  color: 'white',
  fontSize: '0.75rem',
  fontWeight: 600,
})

const userNameClass = css({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'rgb(17, 24, 39)',
})

const userDisplayName = computed(() => {
  const u = user.value
  if (!u) return ''
  if (u.firstname && u.lastname) return `${u.firstname} ${u.lastname}`
  return u.firstname || u.lastname || u.email || ''
})

const userInitials = computed(() => {
  const u = user.value
  if (!u) return 'U'
  if (u.firstname && u.lastname) return (u.firstname[0] + u.lastname[0]).toUpperCase()
  if (u.firstname) return u.firstname[0].toUpperCase()
  if (u.lastname) return u.lastname[0].toUpperCase()
  const prefix = (u.email || '').split('@')[0] || ''
  return (prefix.slice(0, 2) || 'U').toUpperCase()
})
</script>

