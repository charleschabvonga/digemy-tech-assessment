<template>
  <AuthLayout
    icon="mdi:account-plus"
    title="Create Account"
    subtitle="Sign up to get started"
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
            id="firstname"
            v-model="firstname"
            type="text"
            required
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="First name"
          />
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:account" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="lastname"
            v-model="lastname"
            type="text"
            required
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Last name"
          />
        </div>
        
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:email" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Email"
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
            minlength="8"
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Password"
          />
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:lock-check" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            minlength="8"
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm password"
          />
        </div>
        
        <div class="flex justify-center">
          <ActionButton
            type="submit"
            :loading="loading"
            label="Sign up"
            icon="mdi:account-plus"
            variant="blue"
            aria-label="Sign up"
            title="Sign up"
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/" class="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </router-link>
          </p>
        </div>
      </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import ActionButton from '@/components/ActionButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/components/ui/toast/use-toast'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const router = useRouter()
const { register } = useAuth()
const { toast } = useToast()

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  
  if (!firstname.value || !lastname.value || !email.value || !password.value || !passwordConfirmation.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long.'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    await register({
      firstname: firstname.value.trim(),
      lastname: lastname.value.trim(),
      email: email.value.trim(),
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    toast({ title: 'Success', description: 'Account created successfully! Redirecting...' })
    
    router.push('/invoices')
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Sign-up failed. Please try again.'
    const errors = err?.response?.data?.errors
    if (errors && typeof errors === 'object') {
      const firstError = Object.values(errors).flat()[0]
      error.value = firstError || msg
    } else {
      error.value = msg
    }
    toast({ title: 'Error', description: msg, variant: 'destructive' })
  } finally {
    loading.value = false
  }
}
</script>

