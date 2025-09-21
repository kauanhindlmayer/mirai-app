import { defineQuery, useQuery } from '@pinia/colada'
import { getProject } from '~/api/projects'
import type { Project } from '~/types/project'
import { cacheKeys } from '~/utils/cache-keys'

export const useProject = defineQuery(() => {
  const route = useRoute('/projects/[projectId]/summary')

  const query = useQuery({
    staleTime: 1000 * 60 * 60,
    key: () => cacheKeys.projects.get(route.params.projectId),
    query: () => getProject(route.params.projectId),
    enabled: () => 'projectId' in route.params,
    placeholderData: () => ({}) as Project,
  })

  return {
    ...query,
    project: query.data,
  }
})
