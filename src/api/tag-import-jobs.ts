import http from '~/api/http'
import type { HateoasResponse, PaginatedList, PaginationFilter } from '~/types'
import type { TagImportJob } from '~/types/tag'

export function listTagImportJobs(
  projectId: string,
  filters: PaginationFilter,
): Promise<PaginatedList<TagImportJob> & HateoasResponse> {
  const params: Record<string, string> = {
    page: filters.page.toString(),
    pageSize: filters.pageSize.toString(),
  }
  if (filters.sort) params.sort = filters.sort
  if (filters.searchTerm) params.q = filters.searchTerm
  return http.get(`/projects/${projectId}/tags/import`, {
    params,
    headers: {
      accept: 'application/vnd.mirai.hateoas+json',
    },
  })
}

export function createTagImportJob(projectId: string, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  return http.post(`/projects/${projectId}/tags/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
