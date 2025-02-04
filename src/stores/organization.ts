import type { Organization } from '@/types/organization'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrganizationStore = defineStore('organizations', () => {
  const organization = ref<Organization>({} as Organization)

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
