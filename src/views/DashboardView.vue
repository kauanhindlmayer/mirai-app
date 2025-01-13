<script setup lang="ts">
import BurndownChart from '@/components/dashboard/BurndownChart.vue'
import BurnupChart from '@/components/dashboard/BurnupChart.vue'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'

const pageStore = usePageStore()
const { project } = storeToRefs(useProjectStore())

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value!.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value!.id}/dashboard` },
    { label: 'Dashboard', route: `/projects/${project.value!.id}/dashboard` },
  ])
}

onBeforeMount(() => {
  pageStore.setTitle('Dashboard - Overview')
  setBreadcrumbs()
})
</script>

<template>
  <Fluid class="grid grid-cols-12 gap-8">
    <div class="col-span-12 xl:col-span-5">
      <BurndownChart />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <BurnupChart />
    </div>
  </Fluid>
</template>
