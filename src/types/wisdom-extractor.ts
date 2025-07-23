import type { WorkItemType } from '~/types/work-item'

export type WisdomResponse = {
  answer: string
  sources: WorkItemWithDistanceResponse[]
}

export type WorkItemWithDistanceResponse = {
  id: string
  code: number
  title: string
  description?: string
  type: WorkItemType
  createdAtUtc: string
  updatedAtUtc?: string
  distance?: number
}
