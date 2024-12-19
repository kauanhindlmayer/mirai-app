import type { Project } from '@/types'
import { httpClient } from '@/utils/httpClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const project = ref<Project | null>(null)

  async function createProject(project: Partial<Project>, organizationId: string) {
    try {
      await httpClient.post(`/organizations/${organizationId}/projects`, project)
    } catch (error) {
      console.error(error)
    }
  }

  async function getProject(projectId: string) {
    const response = await httpClient.get<Project>(`/projects/${projectId}`)
    project.value = response
    return response
  }

  async function listProjects(organizationId: string) {
    try {
      projects.value = await httpClient.get<Project[]>(`/organizations/${organizationId}/projects`)
    } catch (error) {
      console.error(error)
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
