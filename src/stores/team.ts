import type TeamGateway from '@/gateways/TeamGateway'
import type { BacklogLevel, BacklogResponse, CreateTeamRequest, TeamSummary } from '@/types/team'
import { teamGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useTeamStore = defineStore('teams', () => {
  const teamGateway = inject(teamGatewayKey) as TeamGateway
  const { project } = storeToRefs(useProjectStore())

  const teamId = ref<string | null>(null)
  const teams = ref<TeamSummary[]>([])
  const backlog = ref<BacklogResponse[]>([])

  function setTeamId(id: string) {
    teamId.value = id
  }

  function createTeam(request: CreateTeamRequest) {
    return teamGateway.createTeam(project.value!.id, request)
  }

  async function listTeams() {
    try {
      teams.value = await teamGateway.listTeams(project.value!.id)
    } catch (error) {
      console.error(error)
    }
  }

  async function getBacklog(teamId: string, backlogLevel?: BacklogLevel) {
    backlog.value = await teamGateway.getBacklog(teamId, backlogLevel)
  }

  return {
    teamId,
    teams,
    backlog,
    setTeamId,
    createTeam,
    listTeams,
    getBacklog,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTeamStore, import.meta.hot))
}
