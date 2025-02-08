import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAppToast } from '~/composables/useAppToast'
import { useUserStore } from '~/stores/user'
import type { RequestConfig } from '~/types'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

function setAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem('accessToken')
  if (!token) return config
  const publicRoutes = ['/users/login', '/users/register']
  const isPublicRoute = publicRoutes.includes(config.url!)
  if (!isPublicRoute) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

function handleApiError(error: AxiosError) {
  const toast = useAppToast()
  const Status401Unauthorized = 401

  if (error.response?.status === Status401Unauthorized) {
    const userStore = useUserStore()
    toast.showError({ detail: 'Your session has expired. Please log in again.' })
    userStore.logout()
  }

  return Promise.reject(error)
}

http.interceptors.request.use(setAuthorizationHeader)
http.interceptors.response.use(undefined, handleApiError)

export async function get<T>(url: string, config?: RequestConfig): Promise<T> {
  const response = await http.get<T>(url, config)
  return response.data
}

export async function post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  const response = await http.post<T>(url, data, config)
  return response.data
}

export async function put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  const response = await http.put<T>(url, data, config)
  return response.data
}

export async function patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  const response = await http.patch<T>(url, data, config)
  return response.data
}

export async function remove<T>(url: string, config?: RequestConfig): Promise<T> {
  const response = await http.delete<T>(url, config)
  return response.data
}

export default {
  get,
  post,
  patch,
  put,
  delete: remove,
}
