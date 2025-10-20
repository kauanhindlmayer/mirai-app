import { useQuery } from '@pinia/colada'
import { StorageSerializers, useStorage } from '@vueuse/core'
import { listTeams } from '~/api/teams'
import type { Team } from '~/types/team'
import { useProjectContext } from './project-context'

export function useTeamContext() {
  const team = useStorage<Team>('team', {} as Team, undefined, {
    serializer: StorageSerializers.object,
  })

  const teamId = computed(() => team.value.id ?? '')

  return {
    team,
    teamId,
  }
}

export function useTeamSelection() {
  const { projectId } = useProjectContext()
  const { team, teamId } = useTeamContext()

  const query = useQuery({
    key: () => ['teams', projectId.value],
    query: () => listTeams(projectId.value),
    enabled: () => !!projectId.value,
  })

  function selectFirstTeam() {
    if (team.value.id || !query.data.value?.length) return
    team.value = query.data.value[0]
  }

  watch(query.data, selectFirstTeam, { immediate: true })

  return {
    ...query,
    teams: query.data,
    isLoadingTeams: query.isLoading,
    team,
    teamId,
  }
}
