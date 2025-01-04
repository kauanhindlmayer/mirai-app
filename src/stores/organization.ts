import { displayError } from '@/composables/displayError'
import type OrganizationGateway from '@/gateways/OrganizationGateway'
import type { CreateOrganizationRequest, Organization } from '@/types/organization'
import { organizationGatewayKey } from '@/utils/injection-keys'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useOrganizationStore = defineStore('organizations', () => {
  const organizationGateway = inject(organizationGatewayKey) as OrganizationGateway
  const organizations = ref<Organization[]>([])

  async function createOrganization(request: CreateOrganizationRequest) {
    try {
      await organizationGateway.createOrganization(request)
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
