import http from '@/api/http'
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

export function createWikiPage(projectId: string, request: CreateWikiPageRequest): Promise<string> {
  return http.post(`/projects/${projectId}/wiki-pages`, request)
}

export function updateWikiPage(
  projectId: string,
  wikiPageId: string,
  request: UpdateWikiPageRequest,
): Promise<void> {
  return http.put(`/projects/${projectId}/wiki-pages/${wikiPageId}`, request)
}

export function moveWikiPage(
  projectId: string,
  wikiPageId: string,
  request: MoveWikiPageRequest,
): Promise<void> {
  return http.put(`/projects/${projectId}/wiki-pages/${wikiPageId}/move`, request)
}

export function getWikiPage(projectId: string, wikiPageId: string): Promise<WikiPage> {
  return http.get<WikiPage>(`/projects/${projectId}/wiki-pages/${wikiPageId}`)
}

export function getWikiPageStats(projectId: string, wikiPageId: string): Promise<WikiPageStats> {
  return http.get<WikiPageStats>(`/projects/${projectId}/wiki-pages/${wikiPageId}/stats`)
}

export function listWikiPages(projectId: string): Promise<WikiPageSummary[]> {
  return http.get<WikiPageSummary[]>(`/projects/${projectId}/wiki-pages`)
}

export function deleteWikiPage(projectId: string, wikiPageId: string): Promise<void> {
  return http.delete(`/projects/${projectId}/wiki-pages/${wikiPageId}`)
}

export function addComment(
  projectId: string,
  wikiPageId: string,
  request: AddCommentRequest,
): Promise<void> {
  return http.post(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments`, request)
}

export function updateComment(
  projectId: string,
  wikiPageId: string,
  commentId: string,
  request: UpdateCommentRequest,
): Promise<void> {
  return http.put(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments/${commentId}`, request)
}

export function deleteComment(
  projectId: string,
  wikiPageId: string,
  commentId: string,
): Promise<void> {
  return http.delete(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments/${commentId}`)
}
