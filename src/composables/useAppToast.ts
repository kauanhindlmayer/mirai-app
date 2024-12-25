import toastEventBus from 'primevue/toasteventbus'

type ToastOptions = {
  summary?: string
  detail: string
  life?: number
}

export function useAppToast() {
  const showSuccess = ({ summary = 'Success', detail, life = 3000 }: ToastOptions) => {
    toastEventBus.emit('add', {
      severity: 'success',
      summary,
      detail,
      life,
    })
  }

  const showError = ({ summary = 'Error', detail, life = 3000 }: ToastOptions) => {
    toastEventBus.emit('add', {
      severity: 'error',
      summary,
      detail,
      life,
    })
  }

  return {
    showSuccess,
    showError,
  }
}
