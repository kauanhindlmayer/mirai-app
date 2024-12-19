<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="font-semibold text-xl mb-4">{{ project?.name }}</div>
        <p>{{ project?.description }}</p>
      </div>
    </div>
  </div>
</template>
