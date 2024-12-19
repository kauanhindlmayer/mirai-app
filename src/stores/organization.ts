import type { Organization } from '@/types'
import { httpClient } from '@/utils/http-client'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrganizationStore = defineStore('organizations', () => {
  const organizations = ref<Organization[]>([])

  async function createOrganization(organization: Partial<Organization>) {
    try {
      await httpClient.post('/organizations', organization)
    } catch (error) {
      console.error(error)
    }
  }

  async function listOrganizations() {
    try {
      organizations.value = await httpClient.get<Organization[]>('/organizations')
    } catch (error) {
      console.error(error)
    }
  }

  return {
    organizations,
    createOrganization,
    listOrganizations,
  }
})
