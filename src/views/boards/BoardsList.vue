<script setup lang="ts">
import Board from '@/components/boards/Board.vue'
import type BoardGateway from '@/gateways/BoardGateway'
import { useProjectStore } from '@/stores/project'
import type { BoardSummary, Board as BoardType } from '@/types/board'
import { inject, onBeforeMount, ref, toRef, watch } from 'vue'

const project = toRef(useProjectStore(), 'project')
const selectedBoard = ref()
const boards = ref<BoardSummary[]>([])
const boardGateway = inject<BoardGateway>('boardGateway')!
const board = ref<BoardType | null>(null)

watch(
  () => selectedBoard.value,
  async (newSelectedBoard) => {
    if (!newSelectedBoard) return
    board.value = await boardGateway.getBoard(project.value!.id, newSelectedBoard.id)
  },
)

onBeforeMount(async () => {
  boards.value = await boardGateway.listBoards(project.value!.id)
  selectedBoard.value = boards.value[0]
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex justify-between items-center">
          <Select
            v-model="selectedBoard"
            :options="boards"
            option-label="name"
            class="w-full md:w-56"
          />
          <Button label="View as Backlog" severity="secondary" icon="pi pi-fw pi-arrow-right" />
        </div>
        <Board v-if="board" :board="board" />
      </div>
    </div>
  </div>
</template>
