<script setup lang="ts">
import Board from '@/components/boards/Board.vue'
import { useBoardStore } from '@/stores/board'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { WorkItemType } from '@/types/work-item'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref, watch } from 'vue'

const pageStore = usePageStore()
const boardStore = useBoardStore()
const { board, boards } = storeToRefs(boardStore)
const { project } = storeToRefs(useProjectStore())

const selectedBoard = ref()
const selectedBacklogLevel = ref(WorkItemType.UserStory)
const backlogLevels = ref([
  { label: 'Epics', value: WorkItemType.Epic },
  { label: 'Features', value: WorkItemType.Feature },
  { label: 'User Stories', value: WorkItemType.UserStory },
])

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
        <div class="flex justify-between items-center mb-4">
          <Select v-model="selectedBoard" :options="boards" option-label="name" class="ml-2" />
          <Button label="View as Backlog" severity="secondary" icon="pi pi-fw pi-arrow-right" />
        </div>
        <Tabs value="0">
          <TabList>
            <Tab value="0">Board</Tab>
            <Tab value="1" disabled>Analytics</Tab>
            <div class="ml-auto flex items-center">
              <Select
                v-model="selectedBacklogLevel"
                :options="backlogLevels"
                option-label="label"
                option-value="value"
                class="ml-2"
              />
              <Button
                icon="pi pi-filter"
                severity="secondary"
                variant="text"
                class="ml-2"
                v-tooltip.bottom="'Toggle Filters'"
              />
              <Button
                icon="pi pi-cog"
                severity="secondary"
                variant="text"
                class="ml-2"
                v-tooltip.bottom="'Configure Board Settings'"
              />
              <Button
                icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
                severity="secondary"
                variant="text"
                class="ml-2"
                v-tooltip.bottom="'Enter Full Screen'"
              />
            </div>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <Board v-if="board" :board="board" class="mt-4" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<style>
.p-tablist-tab-list {
  border: none !important;
}
.p-tab.p-disabled {
  border: none !important;
}
</style>
