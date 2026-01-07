<template>
  <AuthLayout
    icon="mdi:key"
    title="Welcome back"
    subtitle="Sign in to your account to continue"
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
            id="email"
            v-model="email"
            type="email"
            required
            :class="inputClass"
            placeholder="username"
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
            :class="inputClass"
            placeholder="password"
          />
        </div>
        
        <div :class="actionsClass">
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

        <div :class="bottomTextWrapperClass">
          <p :class="bottomTextClass">
            Don't have an account?
            <router-link to="/signup" :class="linkClass">
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
import { css } from '../../../../styled-system/css'
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
  marginTop: '1rem',
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
