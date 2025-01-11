import type { HttpClient } from '@/types'
import type { CreateProjectRequest, Project, UpdateProjectRequest } from '@/types/project'

export default interface ProjectGateway {
  createProject(organizationId: string, project: CreateProjectRequest): Promise<string>
  getProject(projectId: string): Promise<Project>
  listProjects(organizationId: string): Promise<Project[]>
  updateProject(
    organizationId: string,
    projectId: string,
    request: UpdateProjectRequest,
  ): Promise<string>
}

export class ProjectGatewayHttp implements ProjectGateway {
  constructor(readonly http: HttpClient) {}

  createProject(organizationId: string, request: CreateProjectRequest): Promise<string> {
    return this.http.post(`/organizations/${organizationId}/projects`, request)
  }

  getProject(projectId: string): Promise<Project> {
    return this.http.get(`/projects/${projectId}`)
  }

  listProjects(organizationId: string): Promise<Project[]> {
    return this.http.get(`/organizations/${organizationId}/projects`)
  }

  updateProject(
    organizationId: string,
    projectId: string,
    request: UpdateProjectRequest,
  ): Promise<string> {
    return this.http.put(`/organizations/${organizationId}/projects/${projectId}`, request)
  }
}
