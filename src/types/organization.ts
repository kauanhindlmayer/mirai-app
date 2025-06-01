export type Organization = {
  id: string
  name: string
  description: string
  createdAtUtc: string
  updatedAtUtc: string
}

export type CreateOrganizationRequest = {
  name: string
  description: string
}
