import { StorageSerializers, useStorage } from '@vueuse/core'
import type { Organization } from '~/types/organization'

const organization = useStorage<Organization>('organization', {} as Organization, undefined, {
  serializer: StorageSerializers.object,
})

export function useOrganizationContext() {
  const organizationId = computed(() => organization.value.id)

  return {
    organization,
    organizationId,
  }
}
