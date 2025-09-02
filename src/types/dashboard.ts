export type DashboardResponse = {
  burnupData: BurnupPoint[]
  burndownData: BurndownPoint[]
  cycleTimeData: CycleTimePoint[]
  leadTimeData: LeadTimePoint[]
  velocityData: VelocityPoint[]
  startDate: string
  endDate: string
}

export type BurnupPoint = {
  date: string
  completedWork: number
  totalWork: number
}

export type BurndownPoint = {
  date: string
  remainingWork: number
}

export type CycleTimePoint = {
  completedDate: string
  cycleTimeDays: number
  workItemTitle: string
  workItemType: string
}

export type LeadTimePoint = {
  completedDate: string
  leadTimeDays: number
  workItemTitle: string
  workItemType: string
}

export type VelocityPoint = {
  sprintName: string
  sprintStartDate: string
  sprintEndDate: string
  completedStoryPoints: number
  completedWorkItems: number
}
