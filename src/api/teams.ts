import http from '@/gateways/HttpClient'
import type { BacklogLevel, BacklogResponse, CreateTeamRequest, Team } from '@/types/team'

export function createTeam(projectId: string, request: CreateTeamRequest): Promise<string> {
  return http.post(`/projects/${projectId}/teams`, request)
}

export function listTeams(projectId: string): Promise<Team[]> {
  return http.get(`/projects/${projectId}/teams`)
}

export function getBacklog(
  teamId: string,
  sprintId?: string,
  backlogLevel?: BacklogLevel,
): Promise<BacklogResponse[]> {
  const params = {} as Record<string, string>
  if (sprintId) params.sprintId = sprintId
  if (backlogLevel) params.backlogLevel = backlogLevel
  return http.get(`/teams/${teamId}/backlogs`, { params })
}
