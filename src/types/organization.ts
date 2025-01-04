export type Organization = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type CreateOrganizationRequest = {
  name: string
  description: string
}
