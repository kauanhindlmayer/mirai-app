import axios from '@/plugins/axios'
import type { Organization } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrganizationStore = defineStore('organizations', () => {
  const organizations = ref<Organization[]>([])

  async function createOrganization(organization: Partial<Organization>) {
    try {
      await axios.post('/organizations', organization)
    } catch (error) {
      console.error(error)
    }
  }

  async function listOrganizations() {
    try {
      const response = await axios.get('/organizations')
      organizations.value = response.data
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
