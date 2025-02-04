import type { Project } from '@/types/project'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const project = ref<Project>({} as Project)

  function setProject(newProject: Project) {
    project.value = newProject
  }

  return {
    project,
    setProject,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
}
