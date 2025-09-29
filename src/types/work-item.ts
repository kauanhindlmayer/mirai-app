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
  assigneeId?: string
  assignee?: AssigneeResponse
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

export type AssigneeResponse = {
  id: string
  fullName: string
  email: string
  imageUrl?: string
}

export type ProjectUserResponse = {
  id: string
  fullName: string
  email: string
  imageUrl?: string
}

export enum WorkItemStatus {
  New = 'New',
  Active = 'Active',
  Resolved = 'Resolved',
  Closed = 'Closed',
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
