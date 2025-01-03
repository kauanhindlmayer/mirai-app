<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Board } from '@/types/board'
import BoardColumn from './BoardColumn.vue'

defineProps<{
  board: Board
}>()
</script>

<template>
  <div class="p-4 h-full overflow-auto">
    <div class="flex flex-row items-start">
      <BoardColumn v-for="column in board.columns" :key="column.id" :column="column" />
    </div>
  </div>
</template>
