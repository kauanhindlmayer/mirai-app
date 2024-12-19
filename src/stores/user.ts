import type { LoginUserRequest, LoginUserResponse, RegisterUserRequest } from '@/types'
import { httpClient } from '@/utils/http-client'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', () => {
  const router = useRouter()
  const toast = useToast()

  async function register(request: RegisterUserRequest) {
    try {
      await httpClient.post('/users/register', {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        password: request.password,
      })
      router.push({ name: 'login' })
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email already exists',
        life: 3000,
      })
    }
  }

  async function login(request: LoginUserRequest) {
    try {
      const response = await httpClient.post<LoginUserResponse>('/users/login', {
        email: request.email,
        password: request.password,
      })
      localStorage.setItem('accessToken', response.accessToken)
      router.push({ name: 'projects' })
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid credentials',
        life: 3000,
      })
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    router.push({ name: 'login' })
  }

  return {
    register,
    login,
    logout,
  }
})
