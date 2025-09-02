<script setup lang="ts">
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'

const pageStore = usePageStore()
pageStore.setTitle('Dashboard - Overview')

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

const selectedTeam = ref<Team | null>()

const { data: teams, isLoading: isLoadingTeams } = useQuery({
  key: () => ['teams'],
  query: () => listTeams(project.value.id),
})

watch(
  () => selectedTeam.value,
  async (newSelectedTeam) => {
    if (!newSelectedTeam) return
    teamStore.setTeamId(newSelectedTeam.id)
  },
)

function selectTeam() {
  if (!teams.value?.length) return
  selectedTeam.value = teams.value[0]
}

watch(() => teams.value, selectTeam)

const {
  data: dashboardData,
  isLoading,
  refetch: refetchDashboardData,
} = useQuery({
  key: () => ['dashboard', teamId.value!],
  query: () => getDashboardData(teamId.value!),
  placeholderData: () => ({}) as DashboardResponse,
  enabled: () => !!teamId.value,
})

const dateRange = computed(() => {
  const { startDate, endDate } = dashboardData.value
  return `${format(startDate)} - ${format(endDate)}`
})

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems: MenuItem[] = [
  { label: 'Dashboard Settings', icon: 'pi pi-cog', disabled: true },
  { label: 'Copy Dashboard', icon: 'pi pi-copy', disabled: true },
]

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value.id}/dashboards` },
    { label: 'Dashboard', route: `/projects/${project.value.id}/dashboards` },
  ])
}

onBeforeMount(() => {
  setBreadcrumbs()
  selectTeam()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <Toolbar>
        <template #start>
          <Select
            v-model="selectedTeam"
            :options="teams"
            :loading="isLoadingTeams"
            option-label="name"
            class="mr-1"
          />
          <Button
            icon="pi pi-users"
            severity="secondary"
            text
            v-tooltip.bottom="'Show Team Profile'"
          />
        </template>

        <template #end>
          <Button label="Edit" icon="pi pi-pencil" severity="secondary" text disabled />
          <Button
            icon="pi pi-refresh"
            severity="secondary"
            text
            :disabled="isLoading"
            v-tooltip.bottom="'Refresh Dashboard'"
            @click="() => refetchDashboardData()"
          />
          <Button
            icon="pi pi-ellipsis-v"
            severity="secondary"
            v-tooltip.bottom="'More Actions'"
            text
            @click="toggleMenuItems"
          />
          <Menu ref="menu" popup :model="menuItems" />
        </template>
      </Toolbar>
    </div>
    <div class="col-span-12 lg:col-span-6">
      <BurndownChart
        :is-loading="isLoading"
        :burndown-data="dashboardData.burndownData"
        :date-range="dateRange"
      />
    </div>
    <div class="col-span-12 lg:col-span-6">
      <BurnupChart
        :is-loading="isLoading"
        :burnup-data="dashboardData.burnupData"
        :date-range="dateRange"
      />
    </div>
    <div class="col-span-12 xl:col-span-4">
      <CycleTimeChart
        :is-loading="isLoading"
        :cycle-time-data="dashboardData.cycleTimeData"
        :date-range="dateRange"
      />
    </div>
    <div class="col-span-12 xl:col-span-4">
      <LeadTimeChart
        :is-loading="isLoading"
        :lead-time-data="dashboardData.leadTimeData"
        :date-range="dateRange"
      />
    </div>
    <div class="col-span-12 xl:col-span-4">
      <VelocityChart
        :is-loading="isLoading"
        :velocity-data="dashboardData.velocityData"
        :date-range="dateRange"
      />
    </div>
  </div>
</template>
