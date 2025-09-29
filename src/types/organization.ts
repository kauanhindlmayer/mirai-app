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

export type OrganizationUserResponse = {
  id: string
  fullName: string
  email: string
  imageUrl?: string
  lastActiveAtUtc?: string
}
