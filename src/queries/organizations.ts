import { defineQuery, useQuery } from '@pinia/colada'
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
    key: () => [
      'organization-users',
      route.params.organizationId,
      filters.value.page,
      filters.value.pageSize,
      filters.value.sort,
      filters.value.searchTerm,
    ],
    query: () => getOrganizationUsers(route.params.organizationId as string, filters.value),
    enabled: () => !!route.params.organizationId,
    placeholderData: () =>
      ({
        items: [],
        totalCount: 0,
        pageSize: 10,
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
      }) as PaginatedList<OrganizationUserResponse>,
  })

  return {
    ...query,
    users: query.data,
    filters,
  }
})
