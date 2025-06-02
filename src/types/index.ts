export type RequestConfig = {
  headers?: Record<string, string>
  params?: Record<string, string>
  data?: unknown
}

export type PaginatedList<T> = {
  items: T[]
  totalCount: number
  pageSize: number
  page: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalPages: number
}

export type PaginationFilter = {
  page: number
  pageSize: number
  sort: string
  searchTerm: string
}

export type Shortcut = {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  category: ShortcutCategory
  description: string
  action: () => void
}

export enum ShortcutCategory {
  Panels = 'Panels',
}
