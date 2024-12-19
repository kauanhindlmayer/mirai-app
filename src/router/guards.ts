import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function ensureProjectLoaded(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const projectId = to.params.projectId as string
  if (!projectId) return next()

  const store = useProjectStore()
  const { project } = storeToRefs(store)

  if (!project.value || project.value.id !== projectId) {
    try {
      await store.getProject(projectId)
    } catch {
      return next({ name: 'projects' })
    }
  }

  next()
}
