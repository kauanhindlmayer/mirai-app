<script setup lang="ts">
import BurndownChart from '@/components/dashboard/BurndownChart.vue'
import BurnupChart from '@/components/dashboard/BurnupChart.vue'
import { displayError } from '@/composables/displayError'
import { useDashboardStore } from '@/stores/dashboard'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useTeamStore } from '@/stores/team'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'

const pageStore = usePageStore()
const dashboardStore = useDashboardStore()
const { project } = storeToRefs(useProjectStore())
const teamStore = useTeamStore()
const { teams } = storeToRefs(teamStore)

const selectedTeam = ref()

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value!.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value!.id}/dashboards` },
    { label: 'Dashboard', route: `/projects/${project.value!.id}/dashboards` },
  ])
}

const isLoading = ref(false)

async function getDashboardData() {
  isLoading.value = true
  try {
    await dashboardStore.getDashboardData()
  } catch (error) {
    displayError(error)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  await teamStore.listTeams()
  selectedTeam.value = teams.value[0]
  pageStore.setTitle('Dashboard - Overview')
  setBreadcrumbs()
  await getDashboardData()
})
</script>

<template>
  <Fluid class="grid grid-cols-12 gap-8">
    <div class="col-span-12">
      <div class="card">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-1">
            <Select v-model="selectedTeam" :options="teams" option-label="name" class="ml-2" />
            <Button
              icon="pi pi-users"
              severity="secondary"
              text
              v-tooltip.bottom="'Show Team Profile'"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 xl:col-span-5">
      <BurndownChart :is-loading="isLoading" />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <BurnupChart :is-loading="isLoading" />
    </div>
  </Fluid>
</template>
