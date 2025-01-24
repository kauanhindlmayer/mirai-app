import type { HttpClient } from '@/types'
import type { BacklogLevel, BacklogResponse, CreateTeamRequest, TeamSummary } from '@/types/team'

export default interface TeamGateway {
  createTeam(projectId: string, request: CreateTeamRequest): Promise<string>
  listTeams(projectId: string): Promise<TeamSummary[]>
  getBacklog(teamId: string, backlogLevel?: BacklogLevel): Promise<BacklogResponse[]>
}

export class TeamGatewayHttp implements TeamGateway {
  constructor(readonly http: HttpClient) {}

  createTeam(projectId: string, request: CreateTeamRequest): Promise<string> {
    return this.http.post(`/projects/${projectId}/teams`, request)
  }

  listTeams(projectId: string): Promise<TeamSummary[]> {
    return this.http.get(`/projects/${projectId}/teams`)
  }

  getBacklog(teamId: string, backlogLevel?: BacklogLevel): Promise<BacklogResponse[]> {
    const params = backlogLevel ? { backlogLevel } : undefined
    return this.http.get(`/teams/${teamId}/backlogs`, { params })
  }
}
