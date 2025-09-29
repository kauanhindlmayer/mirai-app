import http from '~/api/http'
import type { PaginatedList, PaginationFilter } from '~/types'
import type {
  CreateOrganizationRequest,
  Organization,
  OrganizationUserResponse,
  AddUserToOrganizationRequest,
} from '~/types/organization'

export function createOrganization(request: CreateOrganizationRequest): Promise<string> {
  return http.post(`/organizations`, request)
}

export function listOrganizations(): Promise<Organization[]> {
  return http.get(`/organizations`)
}

export function getOrganizationUsers(
  organizationId: string,
  filters: PaginationFilter,
): Promise<PaginatedList<OrganizationUserResponse>> {
  return http.get(`/organizations/${organizationId}/users`, {
    params: filters as unknown as Record<string, string>,
  })
}

export function addUserToOrganization(
  organizationId: string,
  request: AddUserToOrganizationRequest,
): Promise<void> {
  return http.post(`/organizations/${organizationId}/users`, request)
}
