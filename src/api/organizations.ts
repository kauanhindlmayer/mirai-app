import http from '@/api/http'
import type { CreateOrganizationRequest, Organization } from '@/types/organization'

export function createOrganization(request: CreateOrganizationRequest) {
  return http.post<string>(`/organizations`, request)
}

export function listOrganizations() {
  return http.get<Organization[]>(`/organizations`)
}
