<script setup lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import Draggable from 'vuedraggable/src/vuedraggable'
import { moveCard } from '~/api/boards'
import { displayError } from '~/composables/displayError'
import { useTeamStore } from '~/stores/team'
import type { Card, Column, DraggableEvent, MoveCardRequest } from '~/types/board'

const teamStore = useTeamStore()

const { boardId, column } = defineProps<{
  boardId: string
  column: Column
}>()

const cards = ref<Card[]>(column.cards)

type MoveCardMutationPayload = {
  columnId: string
  cardId: string
  request: MoveCardRequest
}

const queryCache = useQueryCache()

const { mutate: moveCardFn } = useMutation({
  mutation: (payload: MoveCardMutationPayload) =>
    moveCard(teamStore.teamId!, boardId, payload.columnId, payload.cardId, payload.request),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['board', boardId] })
  },
  onError: displayError,
})

async function onChange(event: DraggableEvent<Card>) {
  const { moved, added } = event

  if (moved) {
    const card = moved.element
    moveCardFn({
      columnId: card.columnId,
      cardId: card.id,
      request: {
        targetColumnId: column.id,
        targetPosition: moved.newIndex,
      },
    })
  }

  if (added) {
    const card = added.element
    moveCardFn({
      columnId: card.columnId,
      cardId: card.id,
      request: {
        targetColumnId: column.id,
        targetPosition: added.newIndex,
      },
    })
  }
}
</script>

<template>
  <div class="card !p-4 rounded-sm min-w-[250px] max-w-[300px]">
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
    <Draggable v-model="cards" group="board" item-key="id" @change="onChange">
      <template #item="{ element: card }">
        <BoardCard :card="card" />
      </template>
    </Draggable>
  </div>
</template>
