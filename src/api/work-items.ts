import http from '@/api/http'
import type { PaginatedList, PaginationFilter } from '@/types'
import type { WorkItem, WorkItemsStats } from '@/types/work-item'

export function listWorkItems(
  projectId: string,
  filters: PaginationFilter,
): Promise<PaginatedList<WorkItem>> {
  return http.get(`/projects/${projectId}/work-items`, {
    params: filters as unknown as Record<string, string>,
  })
}

export function deleteWorkItem(projectId: string, workItemId: string): Promise<void> {
  return http.delete(`/projects/${projectId}/work-items/${workItemId}`)
}

export function getWorkItemsStats(
  projectId: string,
  periodInDays: number,
): Promise<WorkItemsStats> {
  return http.get(`/projects/${projectId}/work-items/stats`, {
    params: { periodInDays: periodInDays.toString() },
  })
}

export function getWorkItem(projectId: string, workItemId: string): Promise<WorkItem> {
  return http.get(`/projects/${projectId}/work-items/${workItemId}`)
}
