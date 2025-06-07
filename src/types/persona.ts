export type Persona = {
  id: string
  name: string
  description?: string
  imageUrl?: string
  projectId: string
  createdAtUtc: string
  updatedAtUtc?: string
}

export type PersonaBriefResponse = {
  id: string
  name: string
  imageUrl?: string
}

export type CreatePersonaRequest = {
  name: string
  category?: string
  description?: string
  file?: File
}

export type UpdatePersonaRequest = CreatePersonaRequest
