import type { WorkItemStatus, WorkItemType } from '~/types/work-item'

export type Board = {
  id: string
  teamId: string
  name: string
  description: string
  columns: Column[]
}

export type BoardSummary = {
  id: string
  teamId: string
  name: string
}

export type Column = {
  id: string
  name: string
  position: number
  isDefault: boolean
  wipLimit?: number
  definitionOfDone?: string
  cards: Card[]
}

export type Card = {
  id: string
  columnId: string
  position: number
  workItem: WorkItem
  updatedAtUtc: string
  createdAtUtc: string
}

type WorkItem = {
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

export type MoveCardRequest = {
  targetColumnId: string
  targetPosition: number
}

export type DraggableEvent<T> = {
  moved?: {
    element: T
    oldIndex: number
    newIndex: number
  }
  added?: {
    element: T
    newIndex: number
  }
  removed?: {
    element: T
    oldIndex: number
  }
}

export type CreateBoardColumnRequest = {
  name: string
  position: number
  wipLimit?: number
  definitionOfDone?: string
}
