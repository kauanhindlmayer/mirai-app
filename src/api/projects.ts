import http from '~/api/http'
import type { Project } from '~/types/project'

export function createProject(project: Partial<Project>): Promise<string> {
  return http.post(`/organizations/${project.organizationId}/projects`, project)
}

export async function getProject(projectId: string): Promise<Project> {
  return http.get(`/projects/${projectId}`)
}

export function listProjects(organizationId: string): Promise<Project[]> {
  return http.get(`/organizations/${organizationId}/projects`)
}

export function updateProject(project: Partial<Project> & { id: string }): Promise<string> {
  return http.put(`/organizations/${project.organizationId}/projects/${project.id}`, project)
}

export function deleteProject(projectId: string, organizationId: string): Promise<void> {
  return http.delete(`/organizations/${organizationId}/projects/${projectId}`)
}
