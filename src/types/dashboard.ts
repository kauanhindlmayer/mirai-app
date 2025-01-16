export type DashboardResponse = {
  burnupData: BurnupPoint[]
  burndownData: BurndownPoint[]
  startDate: string
  endDate: string
}

export type BurnupPoint = {
  date: string
  completedWork: number
}

export type BurndownPoint = {
  date: string
  remainingWork: number
}
