import type { WorkItem } from '@/types'
import { httpClient } from '@/utils/httpClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProjectStore } from './project'

export const useWorkItemStore = defineStore('workItems', () => {
  const projectStore = useProjectStore()
  const workItems = ref<WorkItem[]>([])

  async function listWorkItems() {
    try {
      workItems.value = await httpClient.get<WorkItem[]>(
        `/v1/projects/${projectStore.projectId}/work-items`,
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteWorkItem(workItemId: string) {
    try {
      await httpClient.delete(`/v1/projects/${projectStore.projectId}/work-items/${workItemId}`)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    workItems,
    listWorkItems,
    deleteWorkItem,
  }
})
