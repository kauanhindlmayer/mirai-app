import type ProjectGateway from '@/gateways/ProjectGateway'
import type { CreateProjectRequest, Project, UpdateProjectRequest } from '@/types/project'
import { projectGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useOrganizationStore } from './organization'

export const useProjectStore = defineStore('projects', () => {
  const projectGateway = inject(projectGatewayKey) as ProjectGateway
  const { organizationId } = storeToRefs(useOrganizationStore())
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

  async function updateProject(projectId: string, request: UpdateProjectRequest) {
    await projectGateway.updateProject(organizationId.value, projectId, request)
  }

  return {
    projects,
    project,
    createProject,
    getProject,
    listProjects,
    updateProject,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
}
