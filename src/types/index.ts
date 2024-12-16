export type Organization = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type Project = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type RegisterUserRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  hasAcceptedTerms: boolean
}

export type LoginUserRequest = {
  email: string
  password: string
  shouldRememberCredentials: boolean
}

export type LoginUserResponse = {
  accessToken: string
}

export type RequestConfig = {
  headers?: Record<string, string>
  params?: Record<string, string>
  data?: unknown
}

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  delete<T>(url: string, config?: RequestConfig): Promise<T>
}

export type WorkItem = {
  id?: string
  code: number
  title: string
  description?: string
  type: WorkItemType
  status: WorkItemStatus
  tags: string[]
  assignedTo: string
  createdAt?: string
  updatedAt: string
}

export enum WorkItemStatus {
  New = 'New',
  InProgress = 'InProgress',
  Closed = 'Closed',
  Resolved = 'Resolved',
  Reopened = 'Reopened',
  Removed = 'Removed',
}

export enum WorkItemType {
  UserStory = 'UserStory',
  Bug = 'Bug',
  Defect = 'Defect',
  Epic = 'Epic',
  Feature = 'Feature',
}
