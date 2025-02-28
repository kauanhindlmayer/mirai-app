<script setup lang="ts">
import RetrospectiveColumn from '~/components/retrospectives/RetrospectiveColumn.vue'
import type { Retrospective } from '~/types/retrospective'

defineProps<{
  retrospective: Retrospective
}>()
</script>

<template>
  <div class="flex gap-4 p-4 pb-0 overflow-auto items-start max-h-[calc(100vh-235px)]">
    <RetrospectiveColumn
      v-for="column in retrospective.columns"
      :key="column.id"
      :retrospective-id="retrospective.id"
      :column="column"
    />
    <ConfirmDialog style="width: 450px" />
  </div>
</template>
