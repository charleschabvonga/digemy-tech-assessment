<template>
  <div :class="layoutClass">
    <Navigation :is-loading="isLoading || loggingOut" @logout="handleLogout" />

    <main :class="mainClass">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          ref="childRef"
          @loading="onLoading"
          @cancel="handleInvoiceCancel"
        />
      </router-view>
    </main>

    <ConfirmModal
      :show="showCancelConfirm"
      :title="isRefund ? 'Refund Invoice' : 'Cancel Invoice'"
      :message="isRefund ? 'Are you sure you want to refund this invoice? This will reverse all payments and cancel the invoice.' : 'Are you sure you want to cancel this invoice? This will also reverse all payments.'"
      :confirm-text="isRefund ? 'Refund Invoice' : 'Cancel Invoice'"
      :loading="cancelling"
      @confirm="confirmCancel"
      @cancel="() => { showCancelConfirm = false; pendingCancelId = null; pendingInvoice = null }"
    />

    <Loading v-if="globalLoading.isLoading.value" :message="globalLoading.loadingMessage.value" />

    <Toaster />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { css } from '../../../styled-system/css'
import Navigation from './Navigation.vue'
import ConfirmModal from './ConfirmModal.vue'
import Toaster from './ui/toast/Toaster.vue'
import { useToast } from './ui/toast/use-toast'
import { invoicesApi } from '../api/invoices'
import { useAuth } from '../composables/useAuth'
import { useLoading } from '../composables/useLoading'
import Loading from './Loading.vue'

const layoutClass = css({
  minHeight: '100vh',
  backgroundColor: 'rgb(243, 244, 246)',
})

const mainClass = css({
  maxWidth: '80rem',
  marginInline: 'auto',
  paddingInline: '1rem',
  paddingBlock: '2rem',
  paddingTop: '6rem',
  '@media (min-width: 640px)': {
    paddingInline: '1.5rem',
  },
  '@media (min-width: 1024px)': {
    paddingInline: '2rem',
  },
})

const router = useRouter()
const route = useRoute()
const { toast } = useToast()

const { checkAuth, logout } = useAuth()
const globalLoading = useLoading()

const isLoading = ref(false)
const loggingOut = ref(false)
const childRef = ref(null)

function onLoading(loading) {
  isLoading.value = loading
}

async function handleLogout() {
  loggingOut.value = true
  globalLoading.showLoading('Logging out...')
  try {
    await logout()
    router.push({ name: 'Login' })
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to logout', variant: 'destructive' })
  } finally {
    loggingOut.value = false
    globalLoading.hideLoading()
  }
}

const showCancelConfirm = ref(false)
const cancelling = ref(false)
const pendingCancelId = ref(null)
const pendingInvoice = ref(null)

const isRefund = computed(() => {
  if (!pendingInvoice.value) return false
  const s = pendingInvoice.value?.state_meta?.name
  return s === 'partially_paid' || s === 'fully_paid' || s === 'refunded'
})

function handleInvoiceCancel(invoice) {
  // Handle both old format (just ID) and new format (invoice object)
  if (typeof invoice === 'object' && invoice !== null) {
    pendingInvoice.value = invoice
    pendingCancelId.value = invoice.id
  } else {
    // Fallback for old format
    pendingCancelId.value = invoice
    pendingInvoice.value = null
  }
  showCancelConfirm.value = true
}

async function confirmCancel() {
  if (!pendingCancelId.value || cancelling.value) return
  cancelling.value = true
  try {
    await invoicesApi.cancel(pendingCancelId.value)
    const successText = isRefund.value ? 'Invoice refunded successfully' : 'Invoice cancelled successfully'
    toast({ title: 'Success', description: successText })

    showCancelConfirm.value = false
    pendingCancelId.value = null
    pendingInvoice.value = null

    await nextTick()

    if (router.currentRoute.value.name === 'Invoices') {
      const page = childRef.value
      if (page && typeof page.reload === 'function') {
        await page.reload()
      } else {
        router.replace({
          name: 'Invoices',
          query: { ...route.query, refresh: Date.now() },
        })
      }
    } else {
      router.push({ name: 'Invoices' })
    }
  } catch (err) {
    const actionText = isRefund.value ? 'refund' : 'cancel'
    const errorMsg = err && err.response && err.response.data && err.response.data.message
      ? err.response.data.message
      : `Failed to ${actionText} invoice`
    toast({ title: 'Error', description: errorMsg, variant: 'destructive' })
  } finally {
    cancelling.value = false
  }
}

onMounted(checkAuth)
</script>

