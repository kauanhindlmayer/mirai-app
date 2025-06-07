import http from '~/api/http'
import type {
  CreatePersonaRequest,
  PersonaBriefResponse,
  UpdatePersonaRequest,
} from '~/types/persona'

export function createPersona(projectId: string, request: CreatePersonaRequest): Promise<string> {
  return http.post(`/projects/${projectId}/personas`, mapRequestToFormData(request), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function getPersona(projectId: string, personaId: string): Promise<string> {
  return http.get(`/projects/${projectId}/personas/${personaId}`)
}

export function listPersonas(projectId: string): Promise<PersonaBriefResponse[]> {
  return http.get(`/projects/${projectId}/personas`)
}

export function updatePersona(
  projectId: string,
  personaId: string,
  request: UpdatePersonaRequest,
): Promise<void> {
  return http.put(`/projects/${projectId}/personas/${personaId}`, mapRequestToFormData(request), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function deletePersona(projectId: string, personaId: string): Promise<void> {
  return http.delete(`/projects/${projectId}/personas/${personaId}`)
}

function mapRequestToFormData(request: CreatePersonaRequest | UpdatePersonaRequest): FormData {
  const formData = new FormData()
  formData.append('name', request.name)
  if (request.description) formData.append('description', request.description)
  if (request.file) formData.append('file', request.file)
  return formData
}
