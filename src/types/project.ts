export type Project = {
  id: string
  name: string
  description: string
  organizationId: string
  createdAt: string
  updatedAt?: string
}

export type CreateProjectRequest = {
  name: string
  description: string
}
