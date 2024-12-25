import { displayError } from '@/composables/displayError'
import type { LoginUserRequest, LoginUserResponse, RegisterUserRequest } from '@/types'
import { httpClient } from '@/utils/http-client'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', () => {
  const router = useRouter()

  async function registerUser(request: RegisterUserRequest) {
    try {
      await httpClient.post('/users/register', request)
      router.push({ name: 'login' })
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function loginUser(request: LoginUserRequest) {
    try {
      const response = await httpClient.post<LoginUserResponse>('/users/login', request)
      localStorage.setItem('accessToken', response.accessToken)
      router.push({ name: 'projects-home' })
    } catch (error: unknown) {
      displayError(error)
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    router.push({ name: 'login' })
  }

  return {
    registerUser,
    loginUser,
    logout,
  }
})
