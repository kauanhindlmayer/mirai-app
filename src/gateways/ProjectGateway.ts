import type { HttpClient, Project } from '@/types'

export default interface ProjectGateway {
  createProject(organizationId: string, project: Partial<Project>): Promise<string>
  getProject(projectId: string): Promise<Project>
  listProjects(organizationId: string): Promise<Project[]>
}

export class ProjectGatewayHttp implements ProjectGateway {
  constructor(readonly httpClient: HttpClient) {}

  createProject(organizationId: string, project: Partial<Project>): Promise<string> {
    return this.httpClient.post(`/organizations/${organizationId}/projects`, project)
  }

  getProject(projectId: string): Promise<Project> {
    return this.httpClient.get(`/projects/${projectId}`)
  }

  listProjects(organizationId: string): Promise<Project[]> {
    return this.httpClient.get(`/organizations/${organizationId}/projects`)
  }
}
