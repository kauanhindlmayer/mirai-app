import type { HttpClient } from '@/types'
import type {
  AddCommentRequest,
  CreateWikiPageRequest,
  MoveWikiPageRequest,
  UpdateCommentRequest,
  UpdateWikiPageRequest,
  WikiPage,
  WikiPageStats,
  WikiPageSummary,
} from '@/types/wiki-page'

export default interface WikiPageGateway {
  createWikiPage(projectId: string, request: CreateWikiPageRequest): Promise<string>
  updateWikiPage(
    projectId: string,
    wikiPageId: string,
    request: UpdateWikiPageRequest,
  ): Promise<void>
  moveWikiPage(projectId: string, wikiPageId: string, request: MoveWikiPageRequest): Promise<void>
  getWikiPage(projectId: string, wikiPageId: string): Promise<WikiPage>
  getWikiPageStats(projectId: string, wikiPageId: string): Promise<WikiPageStats>
  listWikiPages(projectId: string): Promise<WikiPageSummary[]>
  deleteWikiPage(projectId: string, wikiPageId: string): Promise<void>
  addComment(projectId: string, wikiPageId: string, request: AddCommentRequest): Promise<void>
  updateComment(
    projectId: string,
    wikiPageId: string,
    commentId: string,
    request: UpdateCommentRequest,
  ): Promise<void>
  deleteComment(projectId: string, wikiPageId: string, commentId: string): Promise<void>
}

export class WikiPageGatewayHttp implements WikiPageGateway {
  constructor(readonly http: HttpClient) {}

  createWikiPage(projectId: string, request: CreateWikiPageRequest): Promise<string> {
    return this.http.post(`/projects/${projectId}/wiki-pages`, request)
  }

  updateWikiPage(
    projectId: string,
    wikiPageId: string,
    request: UpdateWikiPageRequest,
  ): Promise<void> {
    return this.http.put(`/projects/${projectId}/wiki-pages/${wikiPageId}`, request)
  }

  moveWikiPage(projectId: string, wikiPageId: string, request: MoveWikiPageRequest): Promise<void> {
    return this.http.put(`/projects/${projectId}/wiki-pages/${wikiPageId}/move`, request)
  }

  getWikiPage(projectId: string, wikiPageId: string): Promise<WikiPage> {
    return this.http.get(`/projects/${projectId}/wiki-pages/${wikiPageId}`)
  }

  getWikiPageStats(projectId: string, wikiPageId: string): Promise<WikiPageStats> {
    return this.http.get(`/projects/${projectId}/wiki-pages/${wikiPageId}/stats`)
  }

  listWikiPages(projectId: string): Promise<WikiPageSummary[]> {
    return this.http.get(`/projects/${projectId}/wiki-pages`)
  }

  deleteWikiPage(projectId: string, wikiPageId: string): Promise<void> {
    return this.http.delete(`/projects/${projectId}/wiki-pages/${wikiPageId}`)
  }

  addComment(projectId: string, wikiPageId: string, request: AddCommentRequest): Promise<void> {
    return this.http.post(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments`, request)
  }

  updateComment(
    projectId: string,
    wikiPageId: string,
    commentId: string,
    request: UpdateCommentRequest,
  ): Promise<void> {
    return this.http.put(
      `/projects/${projectId}/wiki-pages/${wikiPageId}/comments/${commentId}`,
      request,
    )
  }

  deleteComment(projectId: string, wikiPageId: string, commentId: string): Promise<void> {
    return this.http.delete(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments/${commentId}`)
  }
}
