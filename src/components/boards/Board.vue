<script setup lang="ts">
import type { Board } from '~/types/board'
import type { BacklogLevel } from '~/types/team'

defineProps<{
  board: Board
  backlogLevel?: BacklogLevel
}>()
</script>

<template>
  <div class="flex gap-4 p-4 pb-0 overflow-x-auto items-start max-h-[calc(100vh-250px)]">
    <BoardColumn
      v-for="column in board.columns"
      :key="column.id"
      :board-id="board.id"
      :column="column"
      :backlog-level="backlogLevel"
    />
    <WorkItemDialog />
  </div>
</template>
