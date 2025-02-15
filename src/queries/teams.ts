import { defineQuery, useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import { listTeams } from '~/api/teams'
import { useProjectStore } from '~/stores/project'
import type { Team } from '~/types/team'

export const useTeams = defineQuery(() => {
  const { project } = storeToRefs(useProjectStore())

  const query = useQuery({
    key: () => ['teams', project.value.id],
    query: () => listTeams(project.value.id),
    placeholderData: () => [] as Team[],
  })

  return {
    ...query,
    teams: query.data,
  }
})
