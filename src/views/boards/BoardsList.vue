<script setup lang="ts">
import Board from '@/components/boards/Board.vue'
import type BoardGateway from '@/gateways/BoardGateway'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import type { BoardSummary, Board as BoardType } from '@/types/board'
import { boardGatewayKey } from '@/utils/injection-keys'
import { inject, onBeforeMount, ref, toRef, watch } from 'vue'

const pageStore = usePageStore()
const project = toRef(useProjectStore(), 'project')
const selectedBoard = ref()
const boards = ref<BoardSummary[]>([])
const boardGateway = inject(boardGatewayKey) as BoardGateway
const board = ref<BoardType | null>(null)

watch(
  () => selectedBoard.value,
  async (newSelectedBoard) => {
    if (!newSelectedBoard) return
    board.value = await boardGateway.getBoard(project.value!.id, newSelectedBoard.id)
    pageStore.setTitle(`${selectedBoard.value?.name} Stories Board - Boards`)
  },
)

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value?.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value?.id}/boards` },
    { label: 'Boards', route: `/projects/${project.value?.id}/boards` },
  ])
}

onBeforeMount(async () => {
  boards.value = await boardGateway.listBoards(project.value!.id)
  selectedBoard.value = boards.value[0]
  setBreadcrumbs()
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
            class="w-full md:w-56 ml-2"
          />
          <Button label="View as Backlog" severity="secondary" icon="pi pi-fw pi-arrow-right" />
        </div>
        <Board v-if="board" :board="board" class="mt-4" />
      </div>
    </div>
  </div>
</template>
