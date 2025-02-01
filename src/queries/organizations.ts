import { listOrganizations } from '@/api/organizations'
import type { Organization } from '@/types/organization'
import { defineQuery, useQuery } from '@pinia/colada'

export const useOrganizations = defineQuery(() => {
  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['organizations'],
    query: listOrganizations,
    placeholderData: [] as Organization[],
  })

  return {
    ...query,
    organizations: query.data,
  }
})
