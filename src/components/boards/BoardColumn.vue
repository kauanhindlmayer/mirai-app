<template>
  <div class="card p-4 mr-4 rounded bg-gray-200 w-72">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-lg">{{ column.name }}</h2>
      <div v-if="column.wipLimit">
        <span
          :class="[
            column.cards.length > column.wipLimit ? 'text-red-700' : 'text-green-700',
            'text-xl',
          ]"
        >
          {{ column.cards.length }}
        </span>
        / {{ column.wipLimit }}
      </div>
    </div>
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
