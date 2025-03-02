import { useQueryCache } from '@pinia/colada'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { getProject } from '~/api/projects'
import { useProjectStore } from '~/stores/project'

export async function ensureProjectLoaded(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const projectId = (to.params as { projectId?: string })?.projectId
  if (!projectId) return next()

  const projectStore = useProjectStore()
  if (!projectStore.project || projectStore.project.id !== projectId) {
    try {
      const project = await getProject(projectId)
      projectStore.setProject(project)

      const queryCache = useQueryCache()
      queryCache.setQueryData(['project', projectId], project)
    } catch {
      return next('/not-found')
    }
  }

  next()
}
