import { StorageSerializers, useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import type { User } from '~/types/user'

export const useUserStore = defineStore('users', () => {
  const router = useRouter()
  const user = useStorage<User | null>('user', null, undefined, {
    serializer: StorageSerializers.object,
  })

  function setUser(newUser: User) {
    user.value = newUser
  }

  function logout() {
    user.value = null
    localStorage.removeItem('accessToken')
    router.push({ name: 'login' })
  }

  return {
    user,
    setUser,
    logout,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
