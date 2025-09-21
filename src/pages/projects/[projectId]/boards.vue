<script setup lang="ts">
import BoardSettingsDrawer from '~/components/boards/BoardSettingsDrawer.vue'
import { BacklogLevel } from '~/types/team'
import { formatEnumOptions } from '~/utils'
import { cacheKeys } from '~/utils/cache-keys'

const pageStore = usePageStore()
const teamStore = useTeamStore()
const { project } = storeToRefs(useProjectStore())
const { onMenuToggle } = useLayout()

const boardSettingsDrawerRef =
  useTemplateRef<InstanceType<typeof BoardSettingsDrawer>>('boardSettingsDrawer')

const selectedBoard = ref<BoardSummary | null>(null)
const selectedBacklogLevel = ref(WorkItemType.UserStory)
const backlogLevels = formatEnumOptions(BacklogLevel)

watch(
  () => selectedBoard.value,
  async (newSelectedBoard) => {
    if (!newSelectedBoard) return
    pageStore.setTitle(`${selectedBoard.value?.name} Stories Board - Boards`)
    teamStore.setTeamId(newSelectedBoard.teamId)
  },
)

const { data: board, isLoading: isLoadingBoard } = useQuery({
  key: () => cacheKeys.boards.get(teamStore.teamId!, selectedBoard.value?.id || ''),
  query: async () => getBoard(teamStore.teamId!, selectedBoard.value?.id || ''),
  enabled: () => !!selectedBoard.value,
})

const router = useRouter()

function redirectToBacklogView() {
  router.push(`/projects/${project.value.id}/backlogs`)
}

const { data: boards, isLoading } = useQuery({
  key: () => ['boards', project.value.id],
  query: () => listBoards(project.value.id),
})

function selectFirstBoard() {
  if (!boards.value?.length) return
  selectedBoard.value = boards.value[0]
}

watch(() => boards.value, selectFirstBoard)

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
  ])
}

onBeforeMount(() => {
  setBreadcrumbs()
  selectFirstBoard()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="board-container card">
        <div class="flex justify-between items-center mb-4 mr-6">
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
              disabled
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
            <div class="ml-auto flex items-center mr-6">
              <Select
                v-model="selectedBacklogLevel"
                :options="backlogLevels"
                option-label="label"
                option-value="value"
                class="ml-2"
                disabled
              />
              <Button
                icon="pi pi-filter"
                severity="secondary"
                variant="text"
                class="ml-2"
                disabled
                v-tooltip.bottom="'Toggle Filters'"
              />
              <Button
                icon="pi pi-cog"
                severity="secondary"
                variant="text"
                class="ml-2"
                disabled
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
              <Board v-if="board" :loading="isLoadingBoard" :board="board" class="mt-4" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
  <BoardSettingsDrawer v-if="board" ref="boardSettingsDrawer" :board="board" />
</template>
