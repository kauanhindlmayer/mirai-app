export const useTeamStore = defineStore('teams', () => {
  const teamId = ref<string | null>(null)

  function setTeamId(id: string) {
    teamId.value = id
  }

  return {
    teamId,
    setTeamId,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTeamStore, import.meta.hot))
}
