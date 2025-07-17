import type { Comment } from '~/types'

export type WorkItem = {
  code: number
  title: string
  description?: string
  acceptanceCriteria?: string
  type: WorkItemType
  status: WorkItemStatus
  planning: Planning
  classification: Classification
  tags: TagBriefResponse[]
  comments: Comment[]
  assignedTo: string
  createdAtUtc?: string
  updatedAtUtc: string
}

export type Planning = {
  storyPoints: number
  priority: number
}

export type Classification = {
  valueArea: ValueArea
}

export enum ValueArea {
  Architectural = 'Architectural',
  Business = 'Business',
}

export type CreateWorkItemRequest = {
  title: string
  type: WorkItemType
  assignedTeamId: string
}

export type TagBriefResponse = {
  id: string
  name: string
  color: string
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

export type WorkItemsStats = {
  workItemsCreated: number
  workItemsCompleted: number
}
