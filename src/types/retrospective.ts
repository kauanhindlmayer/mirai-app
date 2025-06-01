export type Retrospective = {
  id: string
  title: string
  maxVotesPerUser: number
  template: ProcessTemplate
  teamId: string
  columns: RetrospectiveColumn[]
  createdAtUtc: string
  updatedAtUtc?: string
}

export enum ProcessTemplate {
  Classic = 'Classic',
  StartStopContinue = 'StartStopContinue',
  MadSadGlad = 'MadSadGlad',
  LikedLearnedLackedLongedFor = 'LikedLearnedLackedLongedFor',
  Sailboat = 'Sailboat',
}

export type RetrospectiveSummary = {
  id: string
  title: string
}

export type RetrospectiveColumn = {
  id: string
  title: string
  position: number
  items: RetrospectiveItem[]
}

export type RetrospectiveItem = {
  id: string
  content: string
  position: number
  authorId: string
  votes: number
  createdAtUtc: string
  updatedAtUtc?: string
}
