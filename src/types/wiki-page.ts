export type WikiPage = {
  id: string
  projectId: string
  author: Author
  title: string
  content: string
  comments: Comment[]
  createdAtUtc: string
  updatedAtUtc: string
  parentWikiPageId?: string
}

export type WikiPageSummary = {
  id: string
  title: string
  position: number
  subPages: WikiPageSummary[]
}

export type WikiPageStats = {
  views: number
}

export type Comment = {
  id: string
  author: Author
  content: string
  createdAtUtc: string
  updatedAtUtc: string
}

export type Author = {
  name: string
  imageUrl: string
}

export type CreateWikiPageRequest = {
  title: string
  content: string
  parentWikiPageId?: string
}

export type UpdateWikiPageRequest = {
  title: string
  content: string
}

export type MoveWikiPageRequest = {
  targetParentId: string
  targetPosition: number
}

export type AddCommentRequest = {
  content: string
}

export type UpdateCommentRequest = {
  content: string
}
