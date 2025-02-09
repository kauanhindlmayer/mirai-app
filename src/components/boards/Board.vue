<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import BoardColumn from '~/components/boards/BoardColumn.vue'
import WorkItemDialog from '~/components/common/WorkItemDialog.vue'
import type { Board } from '~/types/board'

defineProps<{
  board: Board
}>()
</script>

<template>
  <div class="p-4 h-full overflow-auto">
    <div class="flex flex-row items-start">
      <BoardColumn
        v-for="column in board.columns"
        :key="column.id"
        :board-id="board.id"
        :column="column"
      />
    </div>
    <WorkItemDialog />
  </div>
</template>
