export type Tag = {
  id: string
  name: string
  description: string
  color: string
  workItemsCount: number
}

export type TagImportJob = {
  id: string
  status: TagImportJobStatus
  fileName: string
  totalRecords: number
  processedRecords: number
  successfulRecords: number
  failedRecords: number
  errors: string[]
  createdAtUtc: string
  completedAtUtc?: string
}

export enum TagImportJobStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
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
