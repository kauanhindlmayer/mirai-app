import type { HttpClient } from '@/types'
import type { CreateSprintRequest, SprintResponse } from '@/types/sprint'

export default interface SprintGateway {
  createSprint(teamId: string, request: CreateSprintRequest): Promise<string>
  listSprints(teamId: string): Promise<SprintResponse[]>
  addWorkItemToSprint(teamId: string, sprintId: string, workItemId: string): Promise<void>
}

export class SprintGatewayHttp implements SprintGateway {
  constructor(readonly http: HttpClient) {}

  createSprint(teamId: string, request: CreateSprintRequest): Promise<string> {
    return this.http.post(`/teams/${teamId}/sprints`, request)
  }

  listSprints(teamId: string): Promise<SprintResponse[]> {
    return this.http.get(`/teams/${teamId}/sprints`)
  }

  addWorkItemToSprint(teamId: string, sprintId: string, workItemId: string): Promise<void> {
    return this.http.post(`/teams/${teamId}/sprints/${sprintId}/work-items`, { workItemId })
  }
}
