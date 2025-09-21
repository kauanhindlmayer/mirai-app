/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppToast } from '~/composables/app-toast'

export interface ApiErrorResponse {
  type: string
  title: string
  status: number
  traceId: string
}

export function displayError(error: any) {
  const toast = useAppToast()
  const message = error.response.data.title || 'An error occurred'
  toast.showError({ detail: message })
}
