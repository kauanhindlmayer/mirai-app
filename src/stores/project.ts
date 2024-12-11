import axios from '@/plugins/axios'
import type { Project } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)

  async function createProject(project: Partial<Project>, organizationId: string) {
    try {
      await axios.post(`/organizations/${organizationId}/projects`, project)
    } catch (error) {
      console.error(error)
    }
  }

  async function listProjects(organizationId: string) {
    try {
      const response = await axios.get(`/organizations/${organizationId}/projects`)
      projects.value = response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function getProject(projectId: string) {
    try {
      const response = await axios.get(`/projects/${projectId}`)
      currentProject.value = response.data
    } catch (error) {
      console.error(error)
    }
  }

  return {
    projects,
    createProject,
    listProjects,
    getProject,
  }
})
