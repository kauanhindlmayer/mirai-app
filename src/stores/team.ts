import type SprintGateway from '@/gateways/SprintGateway'
import type TeamGateway from '@/gateways/TeamGateway'
import type { SprintResponse } from '@/types/sprint'
import type { BacklogLevel, BacklogResponse, CreateTeamRequest, Team } from '@/types/team'
import { sprintGatewayKey, teamGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useTeamStore = defineStore('teams', () => {
  const teamGateway = inject(teamGatewayKey) as TeamGateway
  const sprintGateway = inject(sprintGatewayKey) as SprintGateway
  const { project } = storeToRefs(useProjectStore())

  const teamId = ref<string | null>(null)
  const teams = ref<Team[]>([])
  const backlog = ref<BacklogResponse[]>([])
  const sprints = ref<SprintResponse[]>([])

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

  async function getBacklog(teamId: string, sprintId?: string, backlogLevel?: BacklogLevel) {
    backlog.value = await teamGateway.getBacklog(teamId, sprintId, backlogLevel)
  }

  async function listSprints() {
    sprints.value = await sprintGateway.listSprints(teamId.value!)
  }

  return {
    teamId,
    teams,
    backlog,
    sprints,
    setTeamId,
    createTeam,
    listTeams,
    getBacklog,
    listSprints,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTeamStore, import.meta.hot))
}
