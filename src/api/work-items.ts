import http from '@/gateways/HttpClient'
import type { PaginatedList, PaginationFilter } from '@/types'
import type { WorkItem, WorkItemsStats } from '@/types/work-item'

export function listWorkItems(
  projectId: string,
  filters: PaginationFilter,
): Promise<PaginatedList<WorkItem>> {
  return http.get<PaginatedList<WorkItem>>(`/projects/${projectId}/work-items`, {
    params: filters as unknown as Record<string, string>,
  })
}

export function deleteWorkItem(projectId: string, workItemId: string): Promise<void> {
  return http.delete<void>(`/projects/${projectId}/work-items/${workItemId}`)
}

export function getWorkItemsStats(
  projectId: string,
  periodInDays: string,
): Promise<WorkItemsStats> {
  return http.get<WorkItemsStats>(`/projects/${projectId}/work-items/stats`, {
    params: { periodInDays },
  })
}

export function getWorkItem(projectId: string, workItemId: string): Promise<WorkItem> {
  return http.get<WorkItem>(`/projects/${projectId}/work-items/${workItemId}`)
}
