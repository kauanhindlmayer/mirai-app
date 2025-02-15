<script setup lang="ts">
import type { Retrospective } from '~/types/retrospective'

defineProps<{
  retrospective: Retrospective
}>()
</script>

<template>
  <div class="p-4 h-full overflow-auto">
    <div class="flex flex-row items-start">
      <RetrospectiveColumn
        v-for="column in retrospective.columns"
        :key="column.id"
        :column="column"
      />
    </div>
  </div>
</template>
