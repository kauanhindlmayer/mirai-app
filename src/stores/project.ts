import type ProjectGateway from '@/gateways/ProjectGateway'
import type { CreateProjectRequest, Project } from '@/types/project'
import { projectGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projectGateway = inject(projectGatewayKey) as ProjectGateway
  const projects = ref<Project[]>([])
  const project = ref<Project | null>(null)

  async function createProject(organizationId: string, request: CreateProjectRequest) {
    await projectGateway.createProject(organizationId, request)
  }

  async function getProject(projectId: string) {
    project.value = await projectGateway.getProject(projectId)
  }

  async function listProjects(organizationId: string) {
    projects.value = await projectGateway.listProjects(organizationId)
  }

  return {
    projects,
    project,
    createProject,
    getProject,
    listProjects,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
}
