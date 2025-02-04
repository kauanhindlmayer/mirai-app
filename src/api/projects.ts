import http from '@/api/http'
import type { CreateProjectRequest, Project, UpdateProjectRequest } from '@/types/project'

export function createProject(
  organizationId: string,
  request: CreateProjectRequest,
): Promise<string> {
  return http.post<string>(`/organizations/${organizationId}/projects`, request)
}

export async function getProject(projectId: string): Promise<Project> {
  return http.get(`/projects/${projectId}`)
}

export function listProjects(organizationId: string): Promise<Project[]> {
  return http.get(`/organizations/${organizationId}/projects`)
}

export function updateProject(
  organizationId: string,
  projectId: string,
  request: UpdateProjectRequest,
): Promise<string> {
  return http.put(`/organizations/${organizationId}/projects/${projectId}`, request)
}
