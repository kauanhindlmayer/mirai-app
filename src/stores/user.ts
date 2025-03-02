import { StorageSerializers, useStorage } from '@vueuse/core'

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
    router.push('/login')
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
