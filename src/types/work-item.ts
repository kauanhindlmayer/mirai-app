export type WorkItem = {
  code: number
  title: string
  description?: string
  type: WorkItemType
  status: WorkItemStatus
  tags: TagBriefResponse[]
  assignedTo: string
  createdAt?: string
  updatedAt: string
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
