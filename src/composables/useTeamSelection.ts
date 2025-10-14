import { useTeams } from '~/queries/teams'
import { useTeamStore } from '~/stores/team'
import type { Team } from '~/types/team'

export function useTeamSelection() {
  const teamStore = useTeamStore()
  const selectedTeam = ref<Team | null>(null)

  const { teams, isLoading } = useTeams()

  watch(
    teams,
    (newTeams) => {
      if (newTeams?.length && !selectedTeam.value) {
        selectedTeam.value = newTeams[0]
      }
    },
    { immediate: true },
  )

  watch(selectedTeam, (newTeam) => {
    if (newTeam) {
      teamStore.setTeamId(newTeam.id)
    }
  })

  return {
    selectedTeam,
    teams,
    isLoadingTeams: isLoading,
  }
}
