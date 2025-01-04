export type Project = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type CreateProjectRequest = {
  name: string
  description: string
}
