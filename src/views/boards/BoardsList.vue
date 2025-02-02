<script setup lang="ts">
import { getBoard, listBoards } from '@/api/boards'
import Board from '@/components/boards/Board.vue'
import BoardSettingsDrawer from '@/components/boards/BoardSettingsDrawer.vue'
import { useLayout } from '@/layout/composables/layout'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useTeamStore } from '@/stores/team'
import { WorkItemType } from '@/types/work-item'
import { useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'

const pageStore = usePageStore()
const teamStore = useTeamStore()
const { project } = storeToRefs(useProjectStore())
const { onMenuToggle } = useLayout()

const boardSettingsDrawerRef =
  useTemplateRef<InstanceType<typeof BoardSettingsDrawer>>('boardSettingsDrawer')

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
    pageStore.setTitle(`${selectedBoard.value?.name} Stories Board - Boards`)
    teamStore.setTeamId(newSelectedBoard.teamId)
  },
)

const { data: board, isLoading: isBoardLoading } = useQuery({
  key: () => ['board', selectedBoard.value?.id],
  query: async () => getBoard(teamStore.teamId!, selectedBoard.value?.id),
  enabled: () => !!selectedBoard.value,
})

const router = useRouter()

function redirectToBacklogView() {
  router.push(`/projects/${project.value?.id}/backlogs`)
}

const { data: boards, isLoading } = useQuery({
  key: () => ['boards', project.value!.id],
  query: async () => {
    const boards = await listBoards(project.value!.id)
    if (boards.length) {
      selectedBoard.value = boards[0]
    }
    return boards
  },
})

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value?.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value?.id}/boards` },
    { label: 'Boards', route: `/projects/${project.value?.id}/boards` },
  ])
}

onBeforeMount(setBreadcrumbs)
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-1">
            <Select
              v-model="selectedBoard"
              :options="boards"
              :loading="isLoading"
              option-label="name"
            />
            <Button
              icon="pi pi-users"
              severity="secondary"
              text
              v-tooltip.bottom="'Show Team Profile'"
            />
          </div>
          <Button
            label="View as Backlog"
            severity="secondary"
            icon="pi pi-fw pi-arrow-right"
            @click="redirectToBacklogView"
          />
        </div>
        <Tabs value="0" class="board-tabs">
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
                @click="boardSettingsDrawerRef?.showDrawer"
              />
              <Button
                icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
                severity="secondary"
                variant="text"
                class="ml-2"
                v-tooltip.bottom="'Enter Full Screen'"
                @click="onMenuToggle"
              />
            </div>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <Board v-if="board" :loading="isBoardLoading" :board="board" class="mt-4" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
  <BoardSettingsDrawer ref="boardSettingsDrawer" />
</template>

<style>
.board-tabs .p-tablist-tab-list {
  border: none !important;
}
.board-tabs .p-tab.p-disabled {
  border: none !important;
}
</style>
