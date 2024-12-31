<script setup lang="ts">
import { useProjectStore } from '@/stores/project'

const store = useProjectStore()
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="font-semibold text-xl mb-4">{{ store.project!.name }}</div>
        <p>{{ store.project!.description }}</p>
      </div>
    </div>
  </div>
</template>
