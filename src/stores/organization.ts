import type { Organization } from '@/types/organization'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useOrganizationStore = defineStore('organizations', () => {
  const organization = ref<Organization | null>(null)

  const organizationId = computed(() => organization.value?.id ?? '')

  function setOrganization(newOrganization: Organization) {
    organization.value = newOrganization
  }

  return {
    organization,
    organizationId,
    setOrganization,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOrganizationStore, import.meta.hot))
}
