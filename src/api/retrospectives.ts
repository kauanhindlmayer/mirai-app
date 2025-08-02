import http from '~/api/http'
import type { Retrospective, RetrospectiveSummary } from '~/types/retrospective'

export function createRetrospective(retrospective: Partial<Retrospective>): Promise<string> {
  return http.post(`/teams/${retrospective.teamId}/retrospectives`, retrospective)
}

export async function getRetrospective(
  teamId: string,
  retrospectiveId: string,
): Promise<Retrospective> {
  return http.get(`/teams/${teamId}/retrospectives/${retrospectiveId}`)
}

export async function listRetrospectives(teamId: string): Promise<RetrospectiveSummary[]> {
  return http.get(`/teams/${teamId}/retrospectives`)
}

export function createRetrospectiveItem(
  teamId: string,
  retrospectiveId: string,
  columnId: string,
  content: string,
): Promise<string> {
  return http.post(`/teams/${teamId}/retrospectives/${retrospectiveId}/columns/${columnId}/items`, {
    content,
  })
}

export function updateRetrospective(
  teamId: string,
  retrospectiveId: string,
  retrospective: Partial<Retrospective>,
): Promise<void> {
  return http.put(`/teams/${teamId}/retrospectives/${retrospectiveId}`, retrospective)
}

export function deleteRetrospectiveItem(
  teamId: string,
  retrospectiveId: string,
  columnId: string,
  itemId: string,
): Promise<void> {
  return http.delete(
    `/teams/${teamId}/retrospectives/${retrospectiveId}/columns/${columnId}/items/${itemId}`,
  )
}

export function deleteRetrospective(teamId: string, retrospectiveId: string): Promise<void> {
  return http.delete(`/teams/${teamId}/retrospectives/${retrospectiveId}`)
}
