import type { HttpClient, PagedList, PaginationFilter } from '@/types'
import type { WorkItem } from '@/types/work-item'

export default interface WorkItemGateway {
  listWorkItems(projectId: string, filters: PaginationFilter): Promise<PagedList<WorkItem>>
  deleteWorkItem(projectId: string, workItemId: string): Promise<void>
}

export class WorkItemGatewayHttp implements WorkItemGateway {
  constructor(readonly httpClient: HttpClient) {}

  listWorkItems(projectId: string, filters: PaginationFilter): Promise<PagedList<WorkItem>> {
    return this.httpClient.get(`/projects/${projectId}/work-items`, {
      params: filters as unknown as Record<string, string>,
    })
  }

  deleteWorkItem(projectId: string, workItemId: string): Promise<void> {
    return this.httpClient.delete(`/projects/${projectId}/work-items/${workItemId}`)
  }
}
