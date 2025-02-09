export type RequestConfig = {
  headers?: Record<string, string>
  params?: Record<string, string>
  data?: unknown
}

export type PaginatedList<T> = {
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
