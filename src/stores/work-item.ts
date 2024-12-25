import { displayError } from '@/composables/displayError'
import type { PagedList, PaginationFilter, WorkItem } from '@/types'
import { httpClient } from '@/utils/http-client'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useProjectStore } from './project'

export const useWorkItemStore = defineStore('workItems', () => {
  const projectStore = useProjectStore()
  const { project } = storeToRefs(projectStore)
  const workItems = ref<PagedList<WorkItem>>({
    items: [],
    totalCount: 0,
    pageSize: 0,
    pageNumber: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 0,
  })
  const isLoading = ref(false)

  async function listWorkItems(filters: PaginationFilter) {
    try {
      isLoading.value = true
      workItems.value = await httpClient.get<PagedList<WorkItem>>(
        `/projects/${project.value?.id}/work-items`,
        { params: filters as unknown as Record<string, string> },
      )
    } catch (error: unknown) {
      displayError(error)
    } finally {
      isLoading.value = false
    }
  }

  async function deleteWorkItem(workItemId: string) {
    try {
      await httpClient.delete(`/projects/${project.value?.id}/work-items/${workItemId}`)
    } catch (error: unknown) {
      displayError(error)
    }
  }

  return {
    workItems,
    isLoading,
    listWorkItems,
    deleteWorkItem,
  }
})
