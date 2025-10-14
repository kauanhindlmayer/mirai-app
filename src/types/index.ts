export type RequestConfig = {
  headers?: Record<string, string>
  params?: Record<string, string>
  data?: unknown
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
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

export type HateoasResponse = {
  _links: Link[]
}

export type Link = {
  href: string
  rel: string
  method: string
}

export type ApiErrorResponse = {
  type: string
  title: string
  status: number
  traceId: string
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

export type AddCommentRequest = {
  content: string
}

export type UpdateCommentRequest = {
  content: string
}

export type Comment = {
  id: string
  author: Author
  content: string
  createdAtUtc: string
  updatedAtUtc: string
  isPending?: boolean
}

export type Author = {
  id: string
  name: string
  imageUrl: string
}
