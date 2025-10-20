import { StorageSerializers, useStorage } from '@vueuse/core'
import type { Organization } from '~/types/organization'

export function useOrganizationContext() {
  const organization = useStorage<Organization>('organization', {} as Organization, undefined, {
    serializer: StorageSerializers.object,
  })

  const organizationId = computed(() => organization.value?.id ?? '')

  return {
    organization,
    organizationId,
  }
}
