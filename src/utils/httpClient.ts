import type { HttpClient, RequestConfig } from '@/types'
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

class AxiosAdapter implements HttpClient {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: { 'Content-Type': 'application/json' },
    })
    this.axiosInstance.interceptors.request.use(this.setAuthorizationHeader)
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete(url, config)
    return response.data
  }

  private setAuthorizationHeader(config: InternalAxiosRequestConfig) {
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
}

export const httpClient: HttpClient = new AxiosAdapter()
