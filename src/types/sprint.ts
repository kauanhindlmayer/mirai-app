export type CreateSprintRequest = {
  name: string
  startDate: string | null
  endDate: string | null
}

export type Sprint = {
  id: string
  name: string
  startDate: string
  endDate: string
}
