import http from '~/api/http'
import type { PaginatedList, PaginationFilter } from '~/types'
import type { CreateTagRequest, Tag } from '~/types/tag'

export function listTags(
  projectId: string,
  filters: PaginationFilter,
): Promise<PaginatedList<Tag>> {
  const params: Record<string, string> = {
    page: filters.page.toString(),
    pageSize: filters.pageSize.toString(),
  }
  if (filters.sort) params.sort = filters.sort
  if (filters.searchTerm) params.q = filters.searchTerm
  return http.get(`/projects/${projectId}/tags`, { params })
}

export function createTag(projectId: string, request: CreateTagRequest): Promise<void> {
  return http.post(`/projects/${projectId}/tags`, request)
}

export function deleteTag(projectId: string, tagId: string): Promise<void> {
  return http.delete(`/projects/${projectId}/tags/${tagId}`)
}

export function deleteTags(projectId: string, tagIds: string[]): Promise<void> {
  return http.delete(`/projects/${projectId}/tags/bulk`, { data: { tagIds } })
}

export function updateTag(
  projectId: string,
  tagId: string,
  request: CreateTagRequest,
): Promise<void> {
  return http.put(`/projects/${projectId}/tags/${tagId}`, request)
}
