import { StorageSerializers, useStorage } from '@vueuse/core'

export const useOrganizationStore = defineStore('organizations', () => {
  const organization = useStorage<Organization>('organization', {} as Organization, undefined, {
    serializer: StorageSerializers.object,
  })

  function setOrganization(newOrganization: Organization) {
    organization.value = newOrganization
  }

  return {
    organization,
    setOrganization,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOrganizationStore, import.meta.hot))
}
