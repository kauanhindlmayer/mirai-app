import http from '~/api/http'
import type { AddCommentRequest, UpdateCommentRequest } from '~/types'
import type {
  CreateWikiPageRequest,
  MoveWikiPageRequest,
  UpdateWikiPageRequest,
  WikiPage,
  WikiPageStats,
  WikiPageSummary,
} from '~/types/wiki-page'

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
  return http.get(`/projects/${projectId}/wiki-pages/${wikiPageId}`)
}

export function getWikiPageStats(projectId: string, wikiPageId: string): Promise<WikiPageStats> {
  return http.get(`/projects/${projectId}/wiki-pages/${wikiPageId}/stats`)
}

export function listWikiPages(projectId: string): Promise<WikiPageSummary[]> {
  return http.get(`/projects/${projectId}/wiki-pages`)
}

export function deleteWikiPage(projectId: string, wikiPageId: string): Promise<void> {
  return http.delete(`/projects/${projectId}/wiki-pages/${wikiPageId}`)
}

export function addWikiPageComment(
  projectId: string,
  wikiPageId: string,
  request: AddCommentRequest,
): Promise<void> {
  return http.post(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments`, request)
}

export function updateWikiPageComment(
  projectId: string,
  wikiPageId: string,
  commentId: string,
  request: UpdateCommentRequest,
): Promise<void> {
  return http.put(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments/${commentId}`, request)
}

export function deleteWikiPageComment(
  projectId: string,
  wikiPageId: string,
  commentId: string,
): Promise<void> {
  return http.delete(`/projects/${projectId}/wiki-pages/${wikiPageId}/comments/${commentId}`)
}
