import axios from '@/plugins/axios'
import type { LoginUserRequest, RegisterUserRequest } from '@/types'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', () => {
  const router = useRouter()
  const toast = useToast()

  async function register(request: RegisterUserRequest) {
    try {
      await axios.post('/users/register', {
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
      const response = await axios.post('/users/login', {
        email: request.email,
        password: request.password,
      })
      localStorage.setItem('accessToken', response.data.accessToken)
      router.push({ name: 'projects-home' })
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
