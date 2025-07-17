import http from '~/api/http'
import type {
  AddCommentRequest,
  PaginatedList,
  PaginationFilter,
  UpdateCommentRequest,
} from '~/types'
import type { CreateWorkItemRequest, WorkItem, WorkItemsStats } from '~/types/work-item'

export function createWorkItem(
  projectId: string,
  request: CreateWorkItemRequest,
): Promise<WorkItem> {
  return http.post(`/projects/${projectId}/work-items`, request)
}

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

export function addWorkItemComment(
  projectId: string,
  workItemId: string,
  request: AddCommentRequest,
): Promise<void> {
  return http.post(`/projects/${projectId}/work-items/${workItemId}/comments`, request)
}

export function updateWorkItemComment(
  projectId: string,
  workItemId: string,
  commentId: string,
  request: UpdateCommentRequest,
): Promise<void> {
  return http.put(`/projects/${projectId}/work-items/${workItemId}/comments/${commentId}`, request)
}

export function deleteWorkItemComment(
  projectId: string,
  workItemId: string,
  commentId: string,
): Promise<void> {
  return http.delete(`/projects/${projectId}/work-items/${workItemId}/comments/${commentId}`)
}

export function updateWorkItem(
  projectId: string,
  workItemId: string,
  request: Partial<WorkItem>,
): Promise<void> {
  return http.put(`/projects/${projectId}/work-items/${workItemId}`, request)
}

export function addTagToWorkItem(
  projectId: string,
  workItemId: string,
  name: string,
): Promise<void> {
  return http.post(`/projects/${projectId}/work-items/${workItemId}/tags`, { name })
}

export function removeTagFromWorkItem(
  projectId: string,
  workItemId: string,
  tagName: string,
): Promise<void> {
  return http.delete(`/projects/${projectId}/work-items/${workItemId}/tags/${tagName}`)
}
