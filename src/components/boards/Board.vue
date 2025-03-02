<script setup lang="ts">
import type { Board } from '~/types/board'

defineProps<{
  board: Board
}>()
</script>

<template>
  <div class="flex gap-4 p-4 pb-0 overflow-x-auto items-start max-h-[calc(100vh-250px)]">
    <BoardColumn
      v-for="column in board.columns"
      :key="column.id"
      :board-id="board.id"
      :column="column"
    />
    <WorkItemDialog />
  </div>
</template>
