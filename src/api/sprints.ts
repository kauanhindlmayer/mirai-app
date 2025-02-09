import http from '~/api/http'
import type { CreateSprintRequest, Sprint } from '~/types/sprint'

export function createSprint(teamId: string, request: CreateSprintRequest): Promise<string> {
  return http.post(`/teams/${teamId}/sprints`, request)
}

export function listSprints(teamId: string): Promise<Sprint[]> {
  return http.get(`/teams/${teamId}/sprints`)
}

export function addWorkItemToSprint(
  teamId: string,
  sprintId: string,
  workItemId: string,
): Promise<void> {
  return http.post(`/teams/${teamId}/sprints/${sprintId}/work-items`, { workItemId })
}
