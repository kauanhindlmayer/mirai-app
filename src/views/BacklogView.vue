<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { TreeNode } from 'primevue/treenode'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getBacklog, listTeams } from '~/api/teams'
import WorkItemDialog from '~/components/common/WorkItemDialog.vue'
import AppTag from '~/components/tags/AppTag.vue'
import WorkItemTag from '~/components/work-items/WorkItemTag.vue'
import { useLayout } from '~/layout/composables/layout'
import { usePageStore } from '~/stores/page'
import { useProjectStore } from '~/stores/project'
import { useTeamStore } from '~/stores/team'
import { BacklogLevel, type BacklogResponse, type Team } from '~/types/team'
import {
  getBacklogLevelLabel,
  getMoreTagsTooltip,
  getStatusLabel,
  getStatusSeverity,
} from '~/utils/work-item'

const pageStore = usePageStore()
const teamStore = useTeamStore()
const { project } = storeToRefs(useProjectStore())
const { onMenuToggle } = useLayout()

const selectedTeam = ref()
const selectedBacklogLevel = ref(BacklogLevel.Feature)
const backlogLevels = ref([
  { label: 'Epics', value: BacklogLevel.Epic },
  { label: 'Features', value: BacklogLevel.Feature },
  { label: 'User Stories', value: BacklogLevel.UserStory },
])

watch(
  () => selectedTeam.value,
  async (newSelectedTeam) => {
    if (!newSelectedTeam) return
    const backlogLevelName = getBacklogLevelLabel(selectedBacklogLevel.value)
    pageStore.setTitle(`${selectedTeam.value?.name} ${backlogLevelName} Backlog - Boards`)
    teamStore.setTeamId(newSelectedTeam.id)
  },
)

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

function redirectToBoardView() {
  router.push(`/projects/${project.value.id}/boards`)
}

function openWorkItemDialog(workItemId: string) {
  router.replace({ query: { workItemId } })
}

const { data: teams, isLoading } = useQuery({
  key: ['teams', project.value.id],
  query: () => listTeams(project.value.id),
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

const { data: backlog, isLoading: isBacklogLoading } = useQuery({
  key: ['backlog', selectedTeam.value?.id || '', selectedBacklogLevel.value],
  query: async () => getBacklog(selectedTeam.value!.id, undefined, selectedBacklogLevel.value),
  enabled: () => !!selectedTeam.value,
  placeholderData: [] as BacklogResponse[],
})

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Backlogs', route: `/projects/${project.value.id}/backlogs` },
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
          <Button
            label="View as Board"
            severity="secondary"
            icon="pi pi-fw pi-arrow-right"
            @click="redirectToBoardView"
          />
        </div>
        <Tabs value="0" class="board-tabs">
          <TabList>
            <Tab value="0">Backlog</Tab>
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
                @click="onMenuToggle"
              />
            </div>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
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
