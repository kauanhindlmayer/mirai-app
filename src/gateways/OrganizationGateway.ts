import type { HttpClient } from '@/types'
import type { CreateOrganizationRequest, Organization } from '@/types/organization'

export default interface OrganizationGateway {
  createOrganization(request: CreateOrganizationRequest): Promise<string>
  listOrganizations(): Promise<Organization[]>
}

export class OrganizationGatewayHttp implements OrganizationGateway {
  constructor(readonly http: HttpClient) {}

  createOrganization(request: CreateOrganizationRequest): Promise<string> {
    return this.http.post('/organizations', request)
  }

  listOrganizations(): Promise<Organization[]> {
    return this.http.get('/organizations')
  }
}
