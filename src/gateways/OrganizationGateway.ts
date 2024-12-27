import type { HttpClient, Organization } from '@/types'

export default interface OrganizationGateway {
  createOrganization(organization: Partial<Organization>): Promise<string>
  listOrganizations(): Promise<Organization[]>
}

export class OrganizationGatewayHttp implements OrganizationGateway {
  constructor(readonly httpClient: HttpClient) {}

  createOrganization(organization: Partial<Organization>): Promise<string> {
    return this.httpClient.post('/organizations', organization)
  }

  listOrganizations(): Promise<Organization[]> {
    return this.httpClient.get('/organizations')
  }
}
