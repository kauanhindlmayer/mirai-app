import http from '@/api/http'
import type { CreateOrganizationRequest, Organization } from '@/types/organization'

export function createOrganization(request: CreateOrganizationRequest): Promise<string> {
  return http.post(`/organizations`, request)
}

export function listOrganizations(): Promise<Organization[]> {
  return http.get(`/organizations`)
}
