import type { HttpClient } from '@/types'
import type { BacklogLevel, BacklogResponse, CreateTeamRequest, Team } from '@/types/team'

export default interface TeamGateway {
  createTeam(projectId: string, request: CreateTeamRequest): Promise<string>
  listTeams(projectId: string): Promise<Team[]>
  getBacklog(
    teamId: string,
    sprintId?: string,
    backlogLevel?: BacklogLevel,
  ): Promise<BacklogResponse[]>
}

export class TeamGatewayHttp implements TeamGateway {
  constructor(readonly http: HttpClient) {}

  createTeam(projectId: string, request: CreateTeamRequest): Promise<string> {
    return this.http.post(`/projects/${projectId}/teams`, request)
  }

  listTeams(projectId: string): Promise<Team[]> {
    return this.http.get(`/projects/${projectId}/teams`)
  }

  getBacklog(
    teamId: string,
    sprintId?: string,
    backlogLevel?: BacklogLevel,
  ): Promise<BacklogResponse[]> {
    const params = {} as Record<string, string>
    if (sprintId) params.sprintId = sprintId
    if (backlogLevel) params.backlogLevel = backlogLevel
    return this.http.get(`/teams/${teamId}/backlogs`, { params })
  }
}
