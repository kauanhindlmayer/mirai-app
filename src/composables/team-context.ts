import { defineQuery, useQuery } from '@pinia/colada'
import { useStorage } from '@vueuse/core'
import { listTeams } from '~/api/teams'
import type { Team } from '~/types/team'
import { useProjectContext } from './project-context'

/**
 * Provides access to the current team context with per-project persistence.
 * Team selection is persisted in localStorage per project, so each project
 * remembers the last selected team.
 */
export const useTeamContext = defineQuery(() => {
  const route = useRoute()
  const { projectId } = useProjectContext()

  const queryTeamId = computed(() => route.query.teamId as string | undefined)

  const storageKey = computed(() => `team-selection-${projectId.value}`)
  const persistedTeamId = useStorage<string | null>(storageKey.value, null)

  const teamId = computed({
    get: () => queryTeamId.value || persistedTeamId.value,
    set: (value: string | null) => {
      persistedTeamId.value = value
    },
  })

  watch(queryTeamId, (id) => {
    if (id) {
      persistedTeamId.value = id
    }
  })

  watch(projectId, () => {
    if (!queryTeamId.value) {
      persistedTeamId.value = null
    }
  })

  function setTeamId(id: string | null) {
    persistedTeamId.value = id
  }

  return {
    teamId,
    setTeamId,
  }
})

/**
 * Fetches all teams for the current project and provides team selection logic.
 * Automatically selects the first team if no team is selected.
 */
export const useTeamSelection = defineQuery(() => {
  const { projectId } = useProjectContext()
  const { teamId, setTeamId } = useTeamContext()

  const query = useQuery({
    key: () => ['teams', projectId.value],
    query: () => listTeams(projectId.value),
    enabled: () => !!projectId.value,
    placeholderData: () => [] as Team[],
  })

  const selectedTeam = computed(() => {
    if (!teamId.value || !query.data.value?.length) return null
    return query.data.value.find((team) => team.id === teamId.value) ?? null
  })

  watch(
    query.data,
    (newTeams) => {
      if (newTeams?.length && !teamId.value) {
        setTeamId(newTeams[0].id)
      }
    },
    { immediate: true },
  )

  function setSelectedTeam(team: Team | null) {
    setTeamId(team?.id ?? null)
  }

  return {
    ...query,
    teamId,
    teams: query.data,
    selectedTeam,
    setSelectedTeam,
    setTeamId,
    isLoadingTeams: query.isLoading,
  }
})
