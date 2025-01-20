import type { HttpClient, PaginatedList, PaginationFilter } from '@/types'
import type { WorkItem, WorkItemsStats } from '@/types/work-item'

export default interface WorkItemGateway {
  listWorkItems(projectId: string, filters: PaginationFilter): Promise<PaginatedList<WorkItem>>
  deleteWorkItem(projectId: string, workItemId: string): Promise<void>
  getWorkItemsStats(projectId: string, periodInDays: number): Promise<WorkItemsStats>
  getWorkItem(projectId: string, workItemId: string): Promise<WorkItem>
}

export class WorkItemGatewayHttp implements WorkItemGateway {
  constructor(readonly http: HttpClient) {}

  listWorkItems(projectId: string, filters: PaginationFilter): Promise<PaginatedList<WorkItem>> {
    return this.http.get(`/projects/${projectId}/work-items`, {
      params: filters as unknown as Record<string, string>,
    })
  }

  deleteWorkItem(projectId: string, workItemId: string): Promise<void> {
    return this.http.delete(`/projects/${projectId}/work-items/${workItemId}`)
  }

  getWorkItemsStats(projectId: string, periodInDays: number): Promise<WorkItemsStats> {
    return this.http.get(`/projects/${projectId}/work-items/stats`, {
      params: { periodInDays: periodInDays.toString() },
    })
  }

  getWorkItem(projectId: string, workItemId: string): Promise<WorkItem> {
    return this.http.get(`/projects/${projectId}/work-items/${workItemId}`)
  }
}
