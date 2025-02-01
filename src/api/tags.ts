import http from '@/gateways/HttpClient'
import type { CreateTagRequest, Tag } from '@/types/tag'

export function listTags(projectId: string, searchTerm?: string): Promise<Tag[]> {
  const params = searchTerm ? { searchTerm } : undefined
  return http.get<Tag[]>(`/projects/${projectId}/tags`, { params })
}

export function createTag(projectId: string, request: CreateTagRequest): Promise<void> {
  return http.post<void>(`/projects/${projectId}/tags`, request)
}

export function deleteTag(projectId: string, tagId: string): Promise<void> {
  return http.delete<void>(`/projects/${projectId}/tags/${tagId}`)
}

export function updateTag(
  projectId: string,
  tagId: string,
  request: CreateTagRequest,
): Promise<void> {
  return http.put<void>(`/projects/${projectId}/tags/${tagId}`, request)
}
