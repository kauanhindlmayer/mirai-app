import { displayError } from '@/composables/displayError'
import type { Project } from '@/types'
import { httpClient } from '@/utils/http-client'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const project = ref<Project | null>(null)

  async function createProject(project: Partial<Project>, organizationId: string) {
    try {
      await httpClient.post(`/organizations/${organizationId}/projects`, project)
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function getProject(projectId: string) {
    try {
      project.value = await httpClient.get<Project>(`/projects/${projectId}`)
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function listProjects(organizationId: string) {
    try {
      projects.value = await httpClient.get<Project[]>(`/organizations/${organizationId}/projects`)
    } catch (error: unknown) {
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
