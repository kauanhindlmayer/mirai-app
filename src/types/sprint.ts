export type CreateSprintRequest = {
  name: string
  startDate: string
  endDate: string
}

export type SprintResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
}
