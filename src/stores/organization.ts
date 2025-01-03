import { displayError } from '@/composables/displayError'
import type OrganizationGateway from '@/gateways/OrganizationGateway'
import type { Organization } from '@/types'
import { organizationGatewayKey } from '@/utils/injection-keys'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useOrganizationStore = defineStore('organizations', () => {
  const organizationGateway = inject(organizationGatewayKey) as OrganizationGateway
  const organizations = ref<Organization[]>([])

  async function createOrganization(organization: Partial<Organization>) {
    try {
      await organizationGateway.createOrganization(organization)
    } catch (error) {
      displayError(error)
    }
  }

  async function listOrganizations() {
    try {
      organizations.value = await organizationGateway.listOrganizations()
    } catch (error) {
      displayError(error)
    }
  }

  return {
    organizations,
    createOrganization,
    listOrganizations,
  }
})
