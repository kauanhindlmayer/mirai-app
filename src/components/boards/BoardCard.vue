<template>
  <div class="card flex flex-col gap-2">
    <div class="side-color" :style="{ backgroundColor: getTypeColor(card.workItem.type) }" />

    <div class="text-surface-900 dark:text-surface-0">
      <span class="font-medium mr-2">{{ card.workItem.code }}</span>
      {{ card.workItem.title }}
    </div>

    <div class="flex items-center gap-2">
      <Badge :severity="getStatusSeverity(card.workItem.status)" />
      {{ getStatusLabel(card.workItem.status) }}
    </div>

    <!-- TODO: Replace with AutoComplete -->
    <div class="flex items-center">
      <Avatar
        shape="circle"
        :image="assignee?.imageUrl || undefined"
        :icon="assignee?.imageUrl ? undefined : 'pi pi-user'"
        class="mr-2"
      />
      <span class="text-surface-900 dark:text-surface-0">
        {{ assignee?.name || 'Unassigned' }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-2 items-center">
      Story Points
      <InputNumber v-model="storyPoints" fluid class="h-4rem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '@/types/board'
import { getStatusLabel, getStatusSeverity, getTypeColor } from '@/utils'
import { computed, ref } from 'vue'

const { card } = defineProps<{ card: Card }>()
const assignee = computed(() => card.workItem.assignee)

const storyPoints = ref(card.workItem.storyPoints)
</script>

<style>
.p-inputnumber-input {
  height: 1.25rem;
  border: none;
}
.p-inputnumber-input,
.p-autocomplete-input {
  border: none !important;
  box-shadow: none !important;
}
.p-inputtext:hover,
.p-inputtext:focus {
  border: 1px solid var(--p-inputtext-border-color) !important;
  box-shadow: var(--p-inputtext-shadow) !important;
}
.card {
  position: relative;
  overflow: hidden;
  border-radius: 0.25rem;
}
.side-color {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}
</style>
