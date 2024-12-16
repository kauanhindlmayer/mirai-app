import type { Project } from '@/types'
import { httpClient } from '@/utils/httpClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const projectId = ref<string>('')

  async function createProject(project: Partial<Project>, organizationId: string) {
    try {
      await httpClient.post(`/v1/organizations/${organizationId}/projects`, project)
    } catch (error) {
      console.error(error)
    }
  }

  async function listProjects(organizationId: string) {
    try {
      projects.value = await httpClient.get<Project[]>(
        `/v1/organizations/${organizationId}/projects`,
      )
    } catch (error) {
      console.error(error)
    }
  }

  function setProjectId(id: string) {
    projectId.value = id
  }

  return {
    projects,
    projectId,
    createProject,
    listProjects,
    setProjectId,
  }
})
