import { useProjectStore } from '@/stores/project'
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
    await store.getProject(projectId)
  }

  next()
}
