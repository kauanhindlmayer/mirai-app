import { displayError } from '@/composables/displayError'
import type WorkItemGateway from '@/gateways/WorkItemGateway'
import type { PaginatedList, PaginationFilter } from '@/types'
import type { WorkItem } from '@/types/work-item'
import { defineStore } from 'pinia'
import { inject, ref, toRef } from 'vue'
import { useProjectStore } from './project'

export const useWorkItemStore = defineStore('workItems', () => {
  const workItemGateway = inject<WorkItemGateway>('workItemGateway')!
  const project = toRef(useProjectStore(), 'project')
  const workItems = ref<PaginatedList<WorkItem>>({
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
      workItems.value = await workItemGateway.listWorkItems(project.value!.id, filters)
    } catch (error) {
      displayError(error)
    } finally {
      isLoading.value = false
    }
  }

  async function deleteWorkItem(workItemId: string) {
    try {
      await workItemGateway.deleteWorkItem(project.value!.id, workItemId)
    } catch (error) {
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
