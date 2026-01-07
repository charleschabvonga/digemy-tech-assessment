<template>
  <AuthLayout
    icon="mdi:account-plus"
    title="Create Account"
    subtitle="Sign up to get started"
  >
    <form @submit.prevent="handleSubmit" :class="formClass">
        <div v-if="error" :class="errorClass">
          {{ error }}
        </div>
        
        <div :class="fieldWrapperClass">
          <div :class="iconWrapperClass">
            <Icon icon="mdi:account" :class="iconClass" />
          </div>
          <input
            id="firstname"
            v-model="firstname"
            type="text"
            required
            :class="inputClass"
            placeholder="First name"
          />
        </div>

        <div :class="fieldWrapperClass">
          <div :class="iconWrapperClass">
            <Icon icon="mdi:account" :class="iconClass" />
          </div>
          <input
            id="lastname"
            v-model="lastname"
            type="text"
            required
            :class="inputClass"
            placeholder="Last name"
          />
        </div>
        
        <div :class="fieldWrapperClass">
          <div :class="iconWrapperClass">
            <Icon icon="mdi:email" :class="iconClass" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :class="inputClass"
            placeholder="Email"
          />
        </div>
        
        <div :class="fieldWrapperClass">
          <div :class="iconWrapperClass">
            <Icon icon="mdi:lock" :class="iconClass" />
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="8"
            :class="inputClass"
            placeholder="Password"
          />
        </div>

        <div :class="fieldWrapperClass">
          <div :class="iconWrapperClass">
            <Icon icon="mdi:lock-check" :class="iconClass" />
          </div>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            minlength="8"
            :class="inputClass"
            placeholder="Confirm password"
          />
        </div>
        
        <div :class="actionsClass">
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

        <div :class="bottomTextWrapperClass">
          <p :class="bottomTextClass">
            Already have an account?
            <router-link to="/" :class="linkClass">
              Sign in
            </router-link>
          </p>
        </div>
      </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { css } from '../../../../styled-system/css'
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

const formClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

const errorClass = css({
  backgroundColor: 'rgb(254, 242, 242)',
  borderWidth: '1px',
  borderColor: 'rgb(254, 202, 202)',
  color: 'rgb(185, 28, 28)',
  paddingInline: '1rem',
  paddingBlock: '0.75rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
})

const fieldWrapperClass = css({
  position: 'relative',
})

const iconWrapperClass = css({
  position: 'absolute',
  insetBlock: 0,
  insetInlineStart: 0,
  paddingInlineStart: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
})

const iconClass = css({
  width: '1.25rem',
  height: '1.25rem',
  color: 'rgb(156, 163, 175)',
})

const inputClass = css({
  width: '100%',
  paddingInlineStart: '2.5rem',
  paddingInlineEnd: '0.75rem',
  paddingBlock: '0.5rem',
  borderWidth: '1px',
  borderColor: 'rgb(209, 213, 219)',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  outline: 'none',
  _focus: {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)',
  },
})

const actionsClass = css({
  display: 'flex',
  justifyContent: 'center',
})

const bottomTextWrapperClass = css({
  textAlign: 'center',
})

const bottomTextClass = css({
  fontSize: '0.875rem',
  color: 'rgb(75, 85, 99)',
})

const linkClass = css({
  fontWeight: 500,
  color: 'rgb(37, 99, 235)',
  _hover: {
    color: 'rgb(59, 130, 246)',
  },
})

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
    const anyErr = err as any
    const msg =
      anyErr?.response?.data?.message ||
      anyErr?.message ||
      'Sign-up failed. Please try again.'
    const errors = anyErr?.response?.data?.errors
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

