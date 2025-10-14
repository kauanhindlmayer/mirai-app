import type { AxiosError } from 'axios'
import { useAppToast } from '~/composables/app-toast'
import type { ApiErrorResponse } from '~/types'

export function displayError(error: AxiosError<ApiErrorResponse>) {
  const toast = useAppToast()
  const message = error.response?.data.title || 'An error occurred'
  toast.showError({ detail: message })
}
