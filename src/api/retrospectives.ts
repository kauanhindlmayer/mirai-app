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
