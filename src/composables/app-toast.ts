import toastEventBus from 'primevue/toasteventbus'

type ToastOptions = {
  summary?: string
  life?: number
}

export function useAppToast() {
  const success = (message: string, options: ToastOptions = {}) => {
    const { summary = 'Success', life = 3000 } = options
    toastEventBus.emit('add', {
      severity: 'success',
      summary,
      detail: message,
      life,
    })
  }

  const error = (message: string, options: ToastOptions = {}) => {
    const { summary = 'Error', life = 3000 } = options
    toastEventBus.emit('add', {
      severity: 'error',
      summary,
      detail: message,
      life,
    })
  }

  return {
    success,
    error,
  }
}
