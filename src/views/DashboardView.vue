<script setup lang="ts">
import { getDashboardData } from '@/api/dashboards'
import { listTeams } from '@/api/teams'
import BurndownChart from '@/components/dashboard/BurndownChart.vue'
import BurnupChart from '@/components/dashboard/BurnupChart.vue'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import type { Team } from '@/types/team'
import { format } from '@/utils/date'
import { useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { computed, onBeforeMount, ref, useTemplateRef } from 'vue'

const pageStore = usePageStore()
pageStore.setTitle('Dashboard - Overview')

const { project } = storeToRefs(useProjectStore())

const selectedTeam = ref<Team | null>()

const { data: teams, isLoading: isLoadingTeams } = useQuery({
  key: () => ['teams'],
  query: async () => {
    const teams = await listTeams(project.value.id)
    if (teams.length) {
      selectedTeam.value = teams[0]
    }
    return teams
  },
})

const {
  data: dashboardData,
  isLoading,
  refetch: refetchDashboardData,
} = useQuery({
  key: () => ['dashboard', project.value.id],
  query: () => getDashboardData(project.value.id),
  placeholderData: {
    startDate: '',
    endDate: '',
    burndownData: [],
    burnupData: [],
  },
})

const formattedStartDate = computed(() => format(dashboardData.value.startDate))
const formattedEndDate = computed(() => format(dashboardData.value.endDate))
const dateRange = computed(() => `${formattedStartDate.value} - ${formattedEndDate.value}`)

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

onBeforeMount(setBreadcrumbs)
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
    <div class="col-span-12 xl:col-span-5">
      <BurndownChart
        :is-loading="isLoading"
        :burndown-data="dashboardData.burndownData"
        :date-range="dateRange"
      />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <BurnupChart
        :is-loading="isLoading"
        :burnup-data="dashboardData.burnupData"
        :date-range="dateRange"
      />
    </div>
  </div>
</template>
