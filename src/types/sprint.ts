export type CreateSprintRequest = {
  name: string
  startDate: Date | null
  endDate: Date | null
}

export type Sprint = {
  id: string
  name: string
  startDate: string
  endDate: string
}
