import { displayError } from '@/composables/displayError'
import type UserGateway from '@/gateways/UserGateway'
import type { LoginUserRequest, RegisterUserRequest, User } from '@/types/user'
import { userGatewayKey } from '@/utils/injection-keys'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', () => {
  const userGateway = inject(userGatewayKey) as UserGateway
  const router = useRouter()
  const user = ref<User | null>(null)

  async function registerUser(request: RegisterUserRequest) {
    try {
      await userGateway.registerUser(request)
      router.push({ name: 'login' })
    } catch (error) {
      displayError(error)
    }
  }

  async function loginUser(request: LoginUserRequest) {
    try {
      const response = await userGateway.loginUser(request)
      localStorage.setItem('accessToken', response.accessToken)
      router.push({ name: 'projects-home' })
    } catch (error) {
      displayError(error)
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    router.push({ name: 'login' })
  }

  async function getCurrentUser() {
    try {
      user.value = await userGateway.getCurrentUser()
    } catch (error) {
      displayError(error)
    }
  }

  return {
    user,
    registerUser,
    loginUser,
    logout,
    getCurrentUser,
  }
})
