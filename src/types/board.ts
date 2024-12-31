import type { WorkItemStatus, WorkItemType } from './work-item'

export type Board = {
  id: string
  projectId: string
  name: string
  description: string
  columns: Column[]
}

export type BoardSummary = {
  id: string
  name: string
}

export type Column = {
  id: string
  name: string
  position: number
  wipLimit?: number
  definitionOfDone?: string
  cards: Card[]
}

export type Card = {
  id: string
  position: number
  workItem: WorkItem
  updatedAt: string
  createdAt: string
}

export type WorkItem = {
  id: string
  code: string
  title: string
  storyPoints: number
  assignee?: Assignee
  status: WorkItemStatus
  type: WorkItemType
}

export type Assignee = {
  id: string
  name: string
  imageUrl: string
}

export type CreateBoardRequest = {
  name: string
  description: string
}
