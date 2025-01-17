import type { HttpClient } from '@/types'
import type { CreateTagRequest, Tag, UpdateTagRequest } from '@/types/tag'

export default interface TagGateway {
  createTag(projectId: string, tag: CreateTagRequest): Promise<string>
  deleteTag(projectId: string, tagId: string): Promise<void>
  updateTag(projectId: string, tagId: string, request: UpdateTagRequest): Promise<string>
  listTags(projectId: string, searchTerm?: string): Promise<Tag[]>
}

export class TagGatewayHttp implements TagGateway {
  constructor(readonly http: HttpClient) {}

  createTag(projectId: string, request: CreateTagRequest): Promise<string> {
    return this.http.post(`/projects/${projectId}/tags`, request)
  }

  deleteTag(projectId: string, tagId: string): Promise<void> {
    return this.http.delete(`/projects/${projectId}/tags/${tagId}`)
  }

  updateTag(projectId: string, tagId: string, request: UpdateTagRequest): Promise<string> {
    return this.http.put(`/projects/${projectId}/tags/${tagId}`, request)
  }

  listTags(projectId: string, searchTerm?: string): Promise<Tag[]> {
    const params = searchTerm ? { searchTerm } : undefined
    return this.http.get(`/projects/${projectId}/tags`, { params })
  }
}
