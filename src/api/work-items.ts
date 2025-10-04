import http from '~/api/http'
import type {
  AddCommentRequest,
  PaginatedList,
  PaginationFilter,
  UpdateCommentRequest,
} from '~/types'
import type {
  CreateWorkItemLinkRequest,
  CreateWorkItemRequest,
  WorkItem,
  WorkItemsStats,
} from '~/types/work-item'

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
  const params: Record<string, string> = {
    page: filters.page.toString(),
    pageSize: filters.pageSize.toString(),
  }
  if (filters.sort) params.sort = filters.sort
  if (filters.searchTerm) params.q = filters.searchTerm
  return http.get(`/projects/${projectId}/work-items`, { params })
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
  const payload = {
    ...request,
    assigneeId: request.assignee ? request.assignee.id : null,
  }
  delete payload.assignee
  return http.put(`/projects/${projectId}/work-items/${workItemId}`, payload)
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

export function createWorkItemLink(
  projectId: string,
  workItemId: string,
  request: CreateWorkItemLinkRequest,
): Promise<string> {
  return http.post(`/projects/${projectId}/work-items/${workItemId}/links`, request)
}

export function deleteWorkItemLink(
  projectId: string,
  workItemId: string,
  linkId: string,
): Promise<void> {
  return http.delete(`/projects/${projectId}/work-items/${workItemId}/links/${linkId}`)
}

export function uploadWorkItemAttachment(
  projectId: string,
  workItemId: string,
  file: File,
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  return http.post(`/projects/${projectId}/work-items/${workItemId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function downloadWorkItemAttachment(
  projectId: string,
  workItemId: string,
  attachmentId: string,
): Promise<Blob> {
  return http.get(`/projects/${projectId}/work-items/${workItemId}/attachments/${attachmentId}`, {
    responseType: 'blob',
  })
}

export function deleteWorkItemAttachment(
  projectId: string,
  workItemId: string,
  attachmentId: string,
): Promise<void> {
  return http.delete(`/projects/${projectId}/work-items/${workItemId}/attachments/${attachmentId}`)
}
