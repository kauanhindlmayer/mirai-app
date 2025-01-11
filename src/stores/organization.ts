import type OrganizationGateway from '@/gateways/OrganizationGateway'
import type { CreateOrganizationRequest, Organization } from '@/types/organization'
import { organizationGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useOrganizationStore = defineStore('organizations', () => {
  const organizationGateway = inject(organizationGatewayKey) as OrganizationGateway
  const organizations = ref<Organization[]>([])
  const organizationId = ref<string>('')

  function setOrganizationId(id: string) {
    organizationId.value = id
  }

  async function createOrganization(request: CreateOrganizationRequest) {
    await organizationGateway.createOrganization(request)
  }

  async function listOrganizations() {
    organizations.value = await organizationGateway.listOrganizations()
  }

  return {
    organizations,
    organizationId,
    setOrganizationId,
    createOrganization,
    listOrganizations,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOrganizationStore, import.meta.hot))
}
