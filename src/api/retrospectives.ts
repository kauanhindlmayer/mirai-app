import http from '~/api/http'
import type { Retrospective, RetrospectiveSummary } from '~/types/retrospective'

export function createRetrospective(retrospective: Partial<Retrospective>): Promise<string> {
  return http.post('/retrospectives', retrospective)
}

export async function getRetrospective(retrospectiveId: string): Promise<Retrospective> {
  return http.get(`/retrospectives/${retrospectiveId}`)
}

export async function listRetrospectives(teamId: string): Promise<RetrospectiveSummary[]> {
  return http.get(`/teams/${teamId}/retrospectives`)
}

export function createRetrospectiveItem(
  retrospectiveId: string,
  columnId: string,
  content: string,
): Promise<string> {
  return http.post(`/retrospectives/${retrospectiveId}/columns/${columnId}/items`, {
    content,
  })
}

export function updateRetrospective(
  retrospectiveId: string,
  retrospective: Partial<Retrospective>,
): Promise<void> {
  return http.put(`/retrospectives/${retrospectiveId}`, retrospective)
}

export function deleteRetrospectiveItem(
  retrospectiveId: string,
  columnId: string,
  itemId: string,
): Promise<void> {
  return http.delete(`/retrospectives/${retrospectiveId}/columns/${columnId}/items/${itemId}`)
}

export function deleteRetrospective(retrospectiveId: string): Promise<void> {
  return http.delete(`/retrospectives/${retrospectiveId}`)
}
