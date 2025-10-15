import { defineQuery, useQuery } from '@pinia/colada'
import { getProject } from '~/api/projects'
import type { Project } from '~/types/project'

/**
 * Provides access to the current project based on the route parameter.
 */
export const useProjectContext = defineQuery(() => {
  const route = useRoute()
  const projectId = computed(() => (route.params as { projectId?: string }).projectId as string)

  const query = useQuery({
    key: () => ['project', projectId.value],
    query: () => getProject(projectId.value),
    enabled: () => !!projectId.value,
    staleTime: 5 * 60 * 1000,
  })

  return {
    ...query,
    project: computed(() => query.data.value ?? ({} as Project)),
    projectId,
  }
})
