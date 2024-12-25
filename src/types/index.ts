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
}

export type LoginUserRequest = {
  email: string
  password: string
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

export type PagedList<T> = {
  items: T[]
  totalCount: number
  pageSize: number
  pageNumber: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalPages: number
}

export type PaginationFilter = {
  pageNumber: number
  pageSize: number
  sortField: string
  sortOrder: 'asc' | 'desc'
}

export type WikiPageSummary = {
  id: string
  title: string
  subPages: WikiPageSummary[]
}

export type WikiPage = {
  id: string
  projectId: string
  author: Author
  title: string
  content: string
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export type WikiPageStats = {
  views: number
}

export type Comment = {
  id: string
  author: Author
  content: string
  createdAt: string
  updatedAt: string
}

export type Author = {
  name: string
  imageUrl: string
}
