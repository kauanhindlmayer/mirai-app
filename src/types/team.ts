export type CreateTeamRequest = {
  name: string
  description: string
}

export type Team = {
  id: string
  boardId: string
  name: string
}

export type BacklogResponse = {
  id: string
  code: number
  type: string
  title: string
  status: string
  storyPoints: number
  tags: string[]
  children: BacklogResponse[]
}

export enum BacklogLevel {
  Epic = 'Epic',
  Feature = 'Feature',
  UserStory = 'UserStory',
}
