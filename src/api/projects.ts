import http from '~/api/http'
import type { PaginatedList } from '~/types'
import type { Project } from '~/types/project'
import type { ProjectUserResponse } from '~/types/work-item'

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

export function deleteProject(organizationId: string, projectId: string): Promise<void> {
  return http.delete(`/organizations/${organizationId}/projects/${projectId}`)
}

export function getProjectUsers(
  organizationId: string,
  projectId: string,
  searchTerm?: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedList<ProjectUserResponse>> {
  const params: Record<string, string> = {
    page: page.toString(),
    pageSize: pageSize.toString(),
  }
  if (searchTerm) params.q = searchTerm
  return http.get(`/organizations/${organizationId}/projects/${projectId}/users`, { params })
}

export function addUserToProject(
  organizationId: string,
  projectId: string,
  userId: string,
): Promise<void> {
  return http.post(`/organizations/${organizationId}/projects/${projectId}/users`, { userId })
}
