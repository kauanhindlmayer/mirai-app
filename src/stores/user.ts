import type UserGateway from '@/gateways/UserGateway'
import type { LoginUserRequest, RegisterUserRequest, User } from '@/types/user'
import { userGatewayKey } from '@/utils/injection-keys'
import { StorageSerializers, useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
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
    await userGateway.registerUser(request)
    router.push({ name: 'login' })
  }

  async function loginUser(request: LoginUserRequest) {
    const response = await userGateway.loginUser(request)
    accessToken.value = response.accessToken
    router.push({ name: 'projects-home' })
  }

  function logout() {
    user.value = null
    accessToken.value = null
    router.push({ name: 'login' })
  }

  async function getCurrentUser() {
    user.value = await userGateway.getCurrentUser()
  }

  return {
    user,
    registerUser,
    loginUser,
    logout,
    getCurrentUser,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
