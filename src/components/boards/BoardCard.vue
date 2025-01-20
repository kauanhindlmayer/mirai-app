<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import type { Card } from '@/types/board'
import { getStatusLabel, getStatusSeverity, getTypeColor } from '@/utils/work-item'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const { card } = defineProps<{ card: Card }>()
const assignee = computed(() => card.workItem.assignee)

const storyPoints = ref(card.workItem.storyPoints)

const { project } = storeToRefs(useProjectStore())
const router = useRouter()

function openWorkItemDialog() {
  router.push(`/projects/${project.value!.id}/boards?workItemId=${card.workItem.id}`)
}
</script>

<template>
  <div class="card flex flex-col gap-2">
    <div class="side-color" :style="{ backgroundColor: getTypeColor(card.workItem.type) }" />

    <div
      class="text-surface-900 dark:text-surface-0 hover:underline cursor-pointer"
      @click="openWorkItemDialog"
    >
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
      <InputNumber v-model="storyPoints" fluid class="h-4rem story-points-input" />
    </div>
  </div>
</template>

<style>
.story-points-input > .p-inputnumber-input {
  height: 1.25rem;
  border: none;
}
.story-points-input > .p-inputnumber-input,
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
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
.side-color {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}
</style>
