<template>
  <div class="card flex-1 p-4 mr-4 rounded bg-gray-200 min-w-52">
    <h2 class="text-lg font-semibold mb-2">{{ column.name }}</h2>
    <draggable v-model="cards" group="board" item-key="id" @change="onChange">
      <template #item="{ element: card }">
        <BoardCard :card="card" />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import type { Card, Column, DraggableEvent } from '@/types/board'
import { ref } from 'vue'
import draggable from 'vuedraggable/src/vuedraggable'
import BoardCard from './BoardCard.vue'

const boardStore = useBoardStore()

const { column } = defineProps<{ column: Column }>()

const cards = ref<Card[]>(column.cards)

async function onChange(event: DraggableEvent<Card>) {
  const { moved, added } = event

  if (moved) {
    const card = moved.element
    await boardStore.moveCard(card.columnId, card.id, {
      targetColumnId: column.id,
      targetPosition: moved.newIndex,
    })
  }

  if (added) {
    const card = added.element
    await boardStore.moveCard(card.columnId, card.id, {
      targetColumnId: column.id,
      targetPosition: added.newIndex,
    })
  }
}
</script>
