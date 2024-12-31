<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Board } from '@/types/board'
import BoardColumn from './BoardColumn.vue'

defineProps<{
  board: Board
}>()
</script>

<template>
  <div class="flex gap-4">
    <BoardColumn v-for="column in board.columns" :key="column.id" :column="column" />
  </div>
</template>
