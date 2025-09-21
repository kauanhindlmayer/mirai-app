import type { PaginationFilter } from '~/types'

export const cacheKeys = {
  workItems: {
    list: (projectId: string) => ['work-items', projectId],
    filtered: (filters: PaginationFilter) => ['work-items', filters],
    get: (projectId: string, workItemId: string) => ['work-items', projectId, workItemId],
    stats: (projectId: string, periodInDays?: number) =>
      periodInDays
        ? ['work-items', 'stats', projectId, periodInDays]
        : ['work-items', 'stats', projectId],
  },

  wikiPages: {
    list: (projectId: string) => ['wiki-pages', projectId],
    get: (projectId: string, wikiPageId: string) => ['wiki-pages', projectId, wikiPageId],
    stats: (projectId: string, wikiPageId: string) => [
      'wiki-pages',
      'stats',
      projectId,
      wikiPageId,
    ],
  },

  teams: {
    list: (projectId: string) => ['teams', projectId],
  },

  projects: {
    list: (organizationId: string) => ['projects', organizationId],
    get: (projectId: string) => ['projects', projectId],
  },

  boards: {
    get: (teamId: string, boardId: string) => ['boards', teamId, boardId],
    columns: (teamId: string, boardId: string) => ['boards', teamId, boardId, 'columns'],
  },

  retrospectives: {
    list: (teamId: string) => ['retrospectives', teamId],
    get: (teamId: string, retrospectiveId: string) => ['retrospectives', teamId, retrospectiveId],
  },

  personas: {
    list: (projectId: string) => ['personas', projectId],
  },

  tags: {
    list: (projectId: string) => ['tags', projectId],
    importJobs: (projectId: string) => ['tags', projectId, 'import-jobs'],
  },
}
