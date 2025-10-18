import { StorageSerializers, useStorage } from '@vueuse/core'
import type { Organization } from '~/types/organization'

/**
 * Provides access to the current organization context.
 * Organization is persisted in localStorage and shared across the application.
 */
export function useOrganizationContext() {
  const organization = useStorage<Organization>('organization', {} as Organization, undefined, {
    serializer: StorageSerializers.object,
  })

  const organizationId = computed(() => organization.value?.id ?? '')

  function setOrganization(newOrganization: Organization) {
    organization.value = newOrganization
  }

  return {
    organization: computed(() => organization.value ?? ({} as Organization)),
    organizationId,
    setOrganization,
  }
}
