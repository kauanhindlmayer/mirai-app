import { getProject } from '@/api/projects'
import { useProjectStore } from '@/stores/project'
import { useQueryCache } from '@pinia/colada'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function ensureProjectLoaded(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const projectId = to.params.projectId as string
  if (!projectId) return next()

  const store = useProjectStore()
  if (!store.project || store.project.id !== projectId) {
    const project = await getProject(projectId)
    store.setProject(project)
    const queryCache = useQueryCache()
    queryCache.setQueryData(['project', projectId], project)
  }

  next()
}
