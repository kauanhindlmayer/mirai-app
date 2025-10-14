<script setup lang="ts">
import type { TreeNode } from 'primevue/treenode'
import CreateSprintDialog from '~/components/sprints/CreateSprintDialog.vue'

const pageStore = usePageStore()
const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)
const { onMenuToggle } = useLayout()

const { selectedTeam, teams, isLoadingTeams } = useTeamSelection()
const selectedSprint = ref<Sprint | null>(null)
const selectedBacklogLevel = ref<BacklogLevel>(BacklogLevel.UserStory)

const createSprintDialogRef =
  useTemplateRef<InstanceType<typeof CreateSprintDialog>>('createSprintDialog')

const { data: sprints, isLoading: isLoadingSprints } = useQuery({
  key: () => ['sprints', selectedTeam.value?.id || ''],
  query: () => listSprints(selectedTeam.value!.id),
  enabled: () => !!selectedTeam.value,
  placeholderData: () => [] as Sprint[],
})

function selectFirstSprint() {
  if (!sprints.value?.length) return
  selectedSprint.value = sprints.value[0]
}

watch(() => sprints.value, selectFirstSprint)

watch(
  () => selectedSprint.value,
  async (newSelectedSprint) => {
    if (!newSelectedSprint) return
    pageStore.setTitle(`${selectedTeam.value?.name} ${newSelectedSprint.name} Backlog - Boards`)
  },
)

const { data: backlog, isLoading: isLoadingBacklog } = useQuery({
  key: () => [
    'backlog',
    selectedTeam.value?.id || '',
    selectedSprint.value?.id || '',
    selectedBacklogLevel.value,
  ],
  query: async () =>
    getBacklog(selectedTeam.value!.id, selectedSprint.value!.id, selectedBacklogLevel.value),
  enabled: () => !!selectedSprint.value,
  placeholderData: () => [] as BacklogResponse[],
})

const sprintDateRange = computed(() => {
  if (!selectedSprint.value) return ''
  const { startDate, endDate } = selectedSprint.value
  return `${format(startDate, 'MMMM d')} - ${format(endDate, 'MMMM d')}`
})

const remainingWorkingDays = computed(() => {
  if (!selectedSprint.value) return 0
  const { endDate } = selectedSprint.value
  const today = new Date()
  if (isBefore(new Date(endDate), today)) return 0
  return calculateWorkingDays(today, endDate)
})

function calculateWorkingDays(startDate: DateType, endDate: DateType) {
  let current = new Date(startDate)
  const end = new Date(endDate)
  let workingDays = 0

  while (isBefore(current, addDays(end, 1))) {
    if (!isWeekend(current)) {
      workingDays++
    }
    current = addDays(current, 1)
  }

  return workingDays
}

const nodes = computed(() => backlog.value?.map(toNode) ?? [])

function toNode(workItem: BacklogResponse): TreeNode {
  return {
    key: workItem.id,
    label: workItem.title,
    data: workItem,
    children: workItem.children.map(toNode),
  }
}

const router = useRouter()

function openWorkItemDialog(workItemId: string) {
  router.replace({ query: { workItemId } })
}

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Sprints', route: `/projects/${project.value.id}/sprints` },
  ])
}

onBeforeMount(() => {
  setBreadcrumbs()
  selectFirstSprint()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="board-container card">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-1">
            <Select
              v-model="selectedTeam"
              :options="teams"
              :loading="isLoadingTeams"
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
          <Button label="New Work Item" icon="pi pi-plus" class="mr-6" disabled />
        </div>
        <Tabs value="1" class="board-tabs">
          <TabList>
            <Tab value="0" disabled>Taskboard</Tab>
            <Tab value="1">Backlog</Tab>
            <Tab value="2" disabled>Capacity</Tab>
            <Tab value="3" disabled>Analytics</Tab>
            <div class="ml-auto flex items-center mr-6">
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
                v-tooltip.bottom="'Configure Team Settings'"
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
            <TabPanel value="1">
              <div class="flex justify-between items-center my-3">
                <Select
                  v-model="selectedSprint"
                  :options="sprints"
                  :loading="isLoadingSprints"
                  option-label="name"
                >
                  <template #footer>
                    <div class="p-1">
                      <Button
                        label="New Sprint"
                        fluid
                        severity="secondary"
                        text
                        size="small"
                        icon="pi pi-plus"
                        @click="createSprintDialogRef?.showDialog"
                      />
                    </div>
                  </template>
                </Select>
                <div class="mr-6">
                  <div>{{ sprintDateRange }}</div>
                  <div>{{ remainingWorkingDays }} work days remaining</div>
                </div>
              </div>

              <TreeTable
                :value="nodes"
                :loading="isLoadingBacklog"
                scrollable
                scroll-height="calc(100vh - 300px)"
                table-style="min-width: 50rem"
              >
                <Column field="type" header="Type" style="width: 10rem; text-align: center">
                  <template #body="{ node }">
                    <WorkItemTag :type="node.data.type" />
                  </template>
                </Column>
                <Column field="title" expander header="Title" style="width: 30%">
                  <template #body="{ node }">
                    <div
                      class="hover:underline cursor-pointer line-clamp-1"
                      @click="openWorkItemDialog(node.data.id)"
                    >
                      {{ node.data.title }}
                    </div>
                  </template>
                </Column>
                <Column field="status" header="State" style="width: 15%">
                  <template #body="{ node }">
                    <div class="flex items-center gap-2">
                      <Badge :severity="getStatusSeverity(node.data.status)" />
                      {{ getStatusLabel(node.data.status) }}
                    </div>
                  </template>
                </Column>
                <Column field="storyPoints" header="Story Points" style="width: 10%" />
                <Column field="valueArea" header="Value Area" style="width: 20%" />
                <Column field="tags" header="Tags" style="width: 15%">
                  <template #body="{ node }">
                    <div class="flex items-center gap-2">
                      <template v-for="tag in node.data.tags.slice(0, 2)" :key="tag.name">
                        <AppTag :color="tag.color" :label="tag.name" />
                      </template>
                      <span
                        v-if="node.data.tags.length > 2"
                        v-tooltip.bottom="getMoreTagsTooltip(node.data.tags)"
                      >
                        ...
                      </span>
                    </div>
                  </template>
                </Column>
              </TreeTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
  <CreateSprintDialog ref="createSprintDialog" />
  <WorkItemDialog />
</template>
