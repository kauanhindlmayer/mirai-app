<script setup lang="ts">
import BurndownChart from '@/components/dashboard/BurndownChart.vue'
import BurnupChart from '@/components/dashboard/BurnupChart.vue'
import { displayError } from '@/composables/displayError'
import { useDashboardStore } from '@/stores/dashboard'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useTeamStore } from '@/stores/team'
import { storeToRefs } from 'pinia'
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { onBeforeMount, ref, useTemplateRef } from 'vue'

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

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Dashboard Settings', icon: 'pi pi-cog', disabled: true },
  { label: 'Copy Dashboard', icon: 'pi pi-copy', disabled: true },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
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
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <Toolbar>
        <template #start>
          <Select v-model="selectedTeam" :options="teams" option-label="name" class="mr-1" />
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
            @click="getDashboardData"
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
      <BurndownChart :is-loading="isLoading" />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <BurnupChart :is-loading="isLoading" />
    </div>
  </div>
</template>
