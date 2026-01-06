<template>
  <AuthLayout
    icon="mdi:key"
    title="Welcome back"
    subtitle="Sign in to your account to continue"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:account" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="username"
          />
        </div>
        
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:lock" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="password"
          />
        </div>
        
        <div class="flex justify-center">
          <ActionButton
            type="submit"
            :loading="loading"
            label="Sign in"
            icon="mdi:login"
            variant="blue"
            aria-label="Sign in"
            title="Sign in"
          />
        </div>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/signup" class="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </router-link>
          </p>
        </div>
      </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import ActionButton from '@/components/ActionButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/components/ui/toast/use-toast'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()
const { toast } = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please provide both email and password.'
    return
  }

  loading.value = true
  try {
    await login({ email: email.value, password: password.value })

    router.replace(
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
        ? route.query.redirect
        : '/invoices'
    )
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Sign-in failed. Please try again.'
    error.value = msg
    toast({ title: 'Error', description: msg, variant: 'destructive' })
  } finally {
    loading.value = false
  }
}
</script>
