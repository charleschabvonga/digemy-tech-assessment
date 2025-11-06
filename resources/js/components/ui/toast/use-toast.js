import { ref, computed } from 'vue';

const toasts = ref([]);

const TOAST_LIMIT = 3;
let toastCount = 0;

function toast(props) {
  const id = `toast-${++toastCount}`;
  const newToast = {
    id,
    ...props
  };

  toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT);

  return {
    id,
    dismiss: () => dismiss(id),
    update: (newProps) => update(id, newProps)
  };
}

function dismiss(toastId) {
  if (toastId) {
    toasts.value = toasts.value.filter((t) => t.id !== toastId);
  } else {
    toasts.value = [];
  }
}

function update(toastId, props) {
  toasts.value = toasts.value.map((t) =>
    t.id === toastId ? { ...t, ...props } : t
  );
}

export function useToast() {
  return {
    toast,
    dismiss,
    update,
    toasts: computed(() => toasts.value)
  };
}

