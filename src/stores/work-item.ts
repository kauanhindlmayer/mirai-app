import type WorkItemGateway from '@/gateways/WorkItemGateway'
import type { PaginatedList, PaginationFilter } from '@/types'
import type {
  BurndownChartResponse,
  BurnupChartResponse,
  WorkItem,
  WorkItemsStats,
} from '@/types/work-item'
import { workItemGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useWorkItemStore = defineStore('workItems', () => {
  const workItemGateway = inject(workItemGatewayKey) as WorkItemGateway
  const { project } = storeToRefs(useProjectStore())
  const workItems = ref<PaginatedList<WorkItem>>({
    items: [],
    totalCount: 0,
    pageSize: 0,
    pageNumber: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 0,
  })
  const workItemsStats = ref<WorkItemsStats>({ workItemsCreated: 0, workItemsCompleted: 0 })
  const burndownChartData = ref<BurndownChartResponse>({
    dataPoints: [],
    startDate: '',
    endDate: '',
    remainingWorkItems: 0,
  })
  const burnupChartData = ref<BurnupChartResponse>({
    dataPoints: [],
    startDate: '',
    endDate: '',
    completedWorkItems: 0,
  })

  async function listWorkItems(filters: PaginationFilter) {
    workItems.value = await workItemGateway.listWorkItems(project.value!.id, filters)
  }

  async function deleteWorkItem(workItemId: string) {
    await workItemGateway.deleteWorkItem(project.value!.id, workItemId)
  }

  async function getWorkItemsStats(periodInDays: number) {
    workItemsStats.value = await workItemGateway.getWorkItemsStats(project.value!.id, periodInDays)
  }

  async function getBurndownChart() {
    burndownChartData.value = await workItemGateway.getBurndownChart(project.value!.id)
  }

  async function getBurnupChart() {
    burnupChartData.value = await workItemGateway.getBurnupChart(project.value!.id)
  }

  return {
    workItems,
    workItemsStats,
    burndownChartData,
    burnupChartData,
    listWorkItems,
    deleteWorkItem,
    getWorkItemsStats,
    getBurndownChart,
    getBurnupChart,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWorkItemStore, import.meta.hot))
}
