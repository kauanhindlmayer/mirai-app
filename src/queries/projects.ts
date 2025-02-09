import { defineQuery, useQuery } from '@pinia/colada'
import { useRoute } from 'vue-router'
import { getProject } from '~/api/projects'
import type { Project } from '~/types/project'

export const useProject = defineQuery(() => {
  const route = useRoute('/projects/[projectId]/summary')

  const query = useQuery({
    staleTime: 1000 * 60 * 60,
    key: () => ['project', route.params.projectId],
    query: () => getProject(route.params.projectId),
    enabled: () => 'projectId' in route.params,
    placeholderData: () => ({}) as Project,
  })

  return {
    ...query,
    project: query.data,
  }
})
