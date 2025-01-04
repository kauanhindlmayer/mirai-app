import type { HttpClient } from '@/types'
import type { CreateProjectRequest, Project } from '@/types/project'

export default interface ProjectGateway {
  createProject(organizationId: string, project: CreateProjectRequest): Promise<string>
  getProject(projectId: string): Promise<Project>
  listProjects(organizationId: string): Promise<Project[]>
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
}
