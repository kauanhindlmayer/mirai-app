import http from '~/api/http'
import type { CreateProjectRequest, Project } from '~/types/project'

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

export function updateProject(project: Partial<Project> & { id: string }): Promise<string> {
  return http.put(`/organizations/${project.organizationId}/projects/${project.id}`, {
    name: project.name,
    description: project.description,
  })
}
