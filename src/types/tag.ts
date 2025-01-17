export type Tag = {
  id: string
  name: string
  description: string
  color: string
  workItemsCount: number
}

export type CreateTagRequest = {
  name: string
  description: string
  color: string
}

export type UpdateTagRequest = {
  name: string
  description: string
  color: string
}
