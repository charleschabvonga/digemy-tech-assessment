<template>
  <nav v-show="isAuthenticated" class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b" aria-label="Main navigation">
    <div v-if="isLoading" class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden" aria-live="polite">
      <div class="h-full bg-green-500 animate-progress"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <Logo />

        <div class="flex items-center space-x-3">
          <div v-if="user" class="flex items-center gap-2 px-2 py-1 bg-gray-50 border border-gray-200 rounded-full">
            <div class="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-semibold rounded-full" aria-hidden="true">
              {{ userInitials }}
            </div>
            <span class="text-xs font-medium text-gray-900">{{ userDisplayName }}</span>
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
import Logo from './Logo.vue'
import ActionButton from './ActionButton.vue'
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated } = useAuth()

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['logout'])

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

<style scoped>
@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-progress { animation: progress 1.5s ease-in-out infinite; }
</style>

