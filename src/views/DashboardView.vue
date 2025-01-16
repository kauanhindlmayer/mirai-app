<script setup lang="ts">
import BurndownChart from '@/components/dashboard/BurndownChart.vue'
import BurnupChart from '@/components/dashboard/BurnupChart.vue'
import { displayError } from '@/composables/displayError'
import { useDashboardStore } from '@/stores/dashboard'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'

const pageStore = usePageStore()
const dashboardStore = useDashboardStore()
const { project } = storeToRefs(useProjectStore())

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value!.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value!.id}/dashboard` },
    { label: 'Dashboard', route: `/projects/${project.value!.id}/dashboard` },
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
  pageStore.setTitle('Dashboard - Overview')
  setBreadcrumbs()
  await getDashboardData()
})
</script>

<template>
  <Fluid class="grid grid-cols-12 gap-8">
    <div class="col-span-12 xl:col-span-5">
      <BurndownChart :is-loading="isLoading" />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <BurnupChart :is-loading="isLoading" />
    </div>
  </Fluid>
</template>
