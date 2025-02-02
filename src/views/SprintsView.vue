<script setup lang="ts">
import { listSprints } from '@/api/sprints'
import { getBacklog, listTeams } from '@/api/teams'
import WorkItemDialog from '@/components/common/WorkItemDialog.vue'
import CreateSprintDialog from '@/components/sprints/CreateSprintDialog.vue'
import AppTag from '@/components/tags/AppTag.vue'
import WorkItemTag from '@/components/work-items/WorkItemTag.vue'
import { useLayout } from '@/layout/composables/layout'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useTeamStore } from '@/stores/team'
import type { SprintResponse } from '@/types/sprint'
import { BacklogLevel, type BacklogResponse, type Team } from '@/types/team'
import { addDays, format, isBefore, isWeekend, type DateType } from '@/utils/date'
import { getMoreTagsTooltip, getStatusLabel, getStatusSeverity } from '@/utils/work-item'
import { useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { TreeNode } from 'primevue/treenode'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'

const pageStore = usePageStore()
const teamStore = useTeamStore()
const { project } = storeToRefs(useProjectStore())
const { onMenuToggle } = useLayout()

const selectedTeam = ref<Team>()
const selectedSprint = ref<SprintResponse>()
const selectedBacklogLevel = ref<BacklogLevel>(BacklogLevel.UserStory)

const createSprintDialogRef =
  useTemplateRef<InstanceType<typeof CreateSprintDialog>>('createSprintDialog')

watch(
  () => selectedTeam.value,
  async (newSelectedTeam) => {
    if (!newSelectedTeam) return
    teamStore.setTeamId(newSelectedTeam.id)
  },
)

const { data: sprints, isLoading: isSprintsLoading } = useQuery({
  key: ['sprints', selectedTeam.value?.id || ''],
  query: () => listSprints(selectedTeam.value!.id),
  enabled: () => !!selectedTeam.value,
  placeholderData: [] as SprintResponse[],
})

watch(
  () => sprints.value,
  () => {
    if (!sprints.value.length) return
    selectedSprint.value = sprints.value[0]
  },
  { immediate: true },
)

watch(
  () => selectedSprint.value,
  async (newSelectedSprint) => {
    if (!newSelectedSprint) return
    pageStore.setTitle(`${selectedTeam.value?.name} ${newSelectedSprint.name} Backlog - Boards`)
  },
)

const { data: backlog, isLoading: isBacklogLoading } = useQuery({
  key: [
    'backlog',
    selectedTeam.value?.id || '',
    selectedSprint.value?.id || '',
    selectedBacklogLevel.value,
  ],
  query: async () =>
    getBacklog(selectedTeam.value!.id, selectedSprint.value!.id, selectedBacklogLevel.value),
  enabled: () => !!selectedTeam.value && !!selectedSprint.value,
  placeholderData: [] as BacklogResponse[],
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

const nodes = computed(() => backlog.value.map(toNode))

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

const { data: teams, isLoading } = useQuery({
  key: ['teams', project.value!.id],
  query: () => listTeams(project.value!.id),
  placeholderData: [] as Team[],
})

watch(
  () => teams.value,
  () => {
    if (!teams.value.length) return
    selectedTeam.value = teams.value[0]
  },
  { immediate: true },
)

function setBreadcrumbs() {
  const projectName = project.value!.name
  const projectId = project.value!.id
  pageStore.setBreadcrumbs([
    { label: projectName, route: `/projects/${projectId}/summary` },
    { label: 'Boards', route: `/projects/${projectId}/boards` },
    { label: 'Sprints', route: `/projects/${projectId}/sprints` },
  ])
}

onMounted(setBreadcrumbs)
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-1">
            <Select
              v-model="selectedTeam"
              :options="teams"
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
          <Button label="New Work Item" icon="pi pi-plus" />
        </div>
        <Tabs value="1" class="board-tabs">
          <TabList>
            <Tab value="0" disabled>Taskboard</Tab>
            <Tab value="1">Backlog</Tab>
            <Tab value="2" disabled>Capacity</Tab>
            <Tab value="3" disabled>Analytics</Tab>
            <div class="ml-auto flex items-center">
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
              <div class="flex justify-between items-center">
                <Select
                  v-model="selectedSprint"
                  :options="sprints"
                  :loading="isSprintsLoading"
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
                <div>
                  <div>{{ sprintDateRange }}</div>
                  <div>{{ remainingWorkingDays }} work days remaining</div>
                </div>
              </div>

              <TreeTable :value="nodes" :loading="isBacklogLoading" table-style="min-width: 50rem">
                <Column field="type" header="Type" style="width: 10rem; text-align: center">
                  <template #body="{ node }">
                    <WorkItemTag :type="node.data.type" />
                  </template>
                </Column>
                <Column field="title" expander header="Title" style="width: 30%">
                  <template #body="{ node }">
                    <div
                      class="hover:underline cursor-pointer"
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

<style>
.board-tabs .p-tablist-tab-list {
  border: none !important;
}
.board-tabs .p-tab.p-disabled {
  border: none !important;
}
</style>
