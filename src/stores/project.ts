import { displayError } from '@/composables/displayError'
import type ProjectGateway from '@/gateways/ProjectGateway'
import type { Project } from '@/types'
import { projectGatewayKey } from '@/utils/injection-keys'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projectGateway = inject(projectGatewayKey) as ProjectGateway
  const projects = ref<Project[]>([])
  const project = ref<Project | null>(null)

  async function createProject(project: Partial<Project>, organizationId: string) {
    try {
      await projectGateway.createProject(organizationId, project)
    } catch (error) {
      displayError(error)
    }
  }

  async function getProject(projectId: string) {
    try {
      project.value = await projectGateway.getProject(projectId)
    } catch (error) {
      displayError(error)
    }
  }

  async function listProjects(organizationId: string) {
    try {
      projects.value = await projectGateway.listProjects(organizationId)
    } catch (error) {
      displayError(error)
    }
  }

  return {
    projects,
    project,
    createProject,
    getProject,
    listProjects,
  }
})
