<script setup lang="ts">
import Board from '@/components/boards/Board.vue'
import { useBoardStore } from '@/stores/board'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref, watch } from 'vue'

const pageStore = usePageStore()
const boardStore = useBoardStore()
const { board, boards } = storeToRefs(boardStore)
const { project } = storeToRefs(useProjectStore())

const selectedBoard = ref()

watch(
  () => selectedBoard.value,
  async (newSelectedBoard) => {
    if (!newSelectedBoard) return
    await boardStore.getBoard(newSelectedBoard.id)
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
  await boardStore.listBoards()
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
