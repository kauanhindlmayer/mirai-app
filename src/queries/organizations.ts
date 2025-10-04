import { defineQuery, useQuery } from '@pinia/colada'
import type { Ref } from 'vue'
import { getOrganizationUsers } from '~/api/organizations'
import type { PaginatedList, PaginationFilter } from '~/types'
import type { OrganizationUserResponse } from '~/types/organization'

export const useOrganizationUsers = defineQuery(() => {
  const route = useRoute('/organizations/[organizationId]/settings')

  const filters = ref<PaginationFilter>({
    page: 1,
    pageSize: 10,
    sort: '',
    searchTerm: '',
  })

  const query = useQuery({
    staleTime: 1000 * 60 * 5,
    key: () => ['organization-users', route.params.organizationId, filters.value],
    query: () => getOrganizationUsers(route.params.organizationId, filters.value),
    enabled: () => !!route.params.organizationId,
    placeholderData: () => ({}) as PaginatedList<OrganizationUserResponse>,
  })

  return {
    ...query,
    users: query.data,
    filters,
  }
})

export function useAvailableProjectUsers(
  organizationId: string,
  projectId: string,
  enabled?: Ref<boolean>,
) {
  const filters = ref<PaginationFilter>({
    page: 1,
    pageSize: 10,
    sort: '',
    searchTerm: '',
  })

  const query = useQuery({
    staleTime: 1000 * 60 * 5,
    key: () => ['organization-users', organizationId, filters.value, projectId],
    query: () => getOrganizationUsers(organizationId, filters.value, projectId),
    enabled: enabled ? () => enabled.value : undefined,
  })

  return {
    ...query,
    users: query.data,
    filters,
  }
}
