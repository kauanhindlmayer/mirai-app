import { getProject, listProjects } from '@/api/projects'
import { useOrganizationStore } from '@/stores/organization'
import type { Project } from '@/types/project'
import { defineQuery, useQuery } from '@pinia/colada'
import { useRoute } from 'vue-router'

export const useProjects = defineQuery(() => {
  const store = useOrganizationStore()

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['projects', store.organizationId],
    query: () => listProjects(store.organizationId),
    placeholderData: [] as Project[],
    enabled: () => !!store.organizationId,
  })

  return {
    ...query,
    projects: query.data,
  }
})

export const useProject = defineQuery(() => {
  const route = useRoute()
  const projectId = route.params.projectId as string

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['project', projectId],
    query: () => getProject(projectId),
  })

  return {
    ...query,
    project: query.data,
  }
})
