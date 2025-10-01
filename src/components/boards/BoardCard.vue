<script setup lang="ts">
import type { Card } from '~/types/board'

const { card } = defineProps<{ card: Card }>()

const assignee = computed(() => card.workItem.assignee)
const storyPoints = computed(() => card.workItem.storyPoints)

const router = useRouter()

function openWorkItemDialog() {
  router.replace({ query: { workItemId: card.workItem.id } })
}
</script>

<template>
  <div class="board-item card flex flex-col gap-2">
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

    <div class="flex items-center">
      <Avatar
        :image="assignee?.imageUrl || undefined"
        :icon="assignee?.imageUrl ? undefined : 'pi pi-user'"
        pt:image:class="rounded-lg!"
        class="mr-2 rounded-lg!"
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
.story-points-input > .p-inputnumber-input {
  border: none !important;
  box-shadow: none !important;
}
.board-item .p-inputtext:not(.p-autocomplete-input) {
  border: none !important;
  box-shadow: none !important;
}
.board-item .p-inputtext:hover,
.board-item .p-inputtext:focus {
  border: 1px solid var(--p-inputtext-border-color) !important;
  box-shadow: var(--p-inputtext-shadow) !important;
}
.board-item.card {
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
.sortable-drag .board-item {
  transform: rotate(5deg);
}
.sortable-ghost .board-item {
  position: relative;
}
.sortable-ghost .board-item::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-card);
  border-radius: 0.5rem;
}
.sortable-ghost .side-color {
  display: none;
}
</style>
