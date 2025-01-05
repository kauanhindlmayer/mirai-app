<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)
const pageStore = usePageStore()

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value!.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value!.id}/summary` },
    { label: 'Summary', route: `/projects/${project.value!.id}/summary` },
  ])
}

onBeforeMount(() => {
  pageStore.setTitle('Summary - Overview')
  setBreadcrumbs()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="font-semibold text-xl mb-4">{{ project!.name }}</div>
        <p>{{ project!.description }}</p>
      </div>
    </div>
  </div>
</template>
