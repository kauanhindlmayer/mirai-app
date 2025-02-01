import http from '@/gateways/HttpClient'
import type { CreateProjectRequest, Project, UpdateProjectRequest } from '@/types/project'

export function createProject(
  organizationId: string,
  request: CreateProjectRequest,
): Promise<string> {
  return http.post<string>(`/organizations/${organizationId}/projects`, request)
}

export async function getProject(projectId: string): Promise<Project> {
  return http.get<Project>(`/projects/${projectId}`)
}

export function listProjects(organizationId: string): Promise<Project[]> {
  return http.get<Project[]>(`/organizations/${organizationId}/projects`)
}

export function updateProject(
  organizationId: string,
  projectId: string,
  request: UpdateProjectRequest,
): Promise<string> {
  return http.put<string>(`/organizations/${organizationId}/projects/${projectId}`, request)
}
