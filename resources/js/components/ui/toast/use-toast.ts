import { ref, computed } from 'vue'

export type ToastVariant = 'default' | 'destructive'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastProps {
  id?: string
  title?: string
  description?: string
  action?: ToastAction | null
  variant?: ToastVariant
  duration?: number
}

export interface ToastState extends ToastProps {
  id: string
}

export interface ToastHandle {
  id: string
  dismiss: () => void
  update: (newProps: Partial<ToastProps>) => void
}

const toasts = ref<ToastState[]>([])

const TOAST_LIMIT = 3
let toastCount = 0

function toast(props: ToastProps): ToastHandle {
  const id = `toast-${++toastCount}`
  const newToast: ToastState = {
    id,
    ...props,
  }

  toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT)

  return {
    id,
    dismiss: () => dismiss(id),
    update: newProps => update(id, newProps),
  }
}

function dismiss(toastId?: string): void {
  if (toastId) {
    toasts.value = toasts.value.filter(t => t.id !== toastId)
  } else {
    toasts.value = []
  }
}

function update(toastId: string, props: Partial<ToastProps>): void {
  toasts.value = toasts.value.map(t =>
    t.id === toastId ? { ...t, ...props } : t,
  )
}

export function useToast() {
  return {
    toast,
    dismiss,
    update,
    toasts: computed(() => toasts.value),
  }
}
