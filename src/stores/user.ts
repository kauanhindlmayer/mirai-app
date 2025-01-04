import { displayError } from '@/composables/displayError'
import type UserGateway from '@/gateways/UserGateway'
import type { LoginUserRequest, RegisterUserRequest, User } from '@/types/user'
import { userGatewayKey } from '@/utils/injection-keys'
import { StorageSerializers, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', () => {
  const userGateway = inject(userGatewayKey) as UserGateway
  const router = useRouter()
  const user = useStorage<User | null>('user', null, undefined, {
    serializer: StorageSerializers.object,
  })
  const accessToken = useStorage<string | null>('accessToken', null)

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
      accessToken.value = response.accessToken
      router.push({ name: 'projects-home' })
    } catch (error) {
      displayError(error)
    }
  }

  function logout() {
    accessToken.value = null
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
