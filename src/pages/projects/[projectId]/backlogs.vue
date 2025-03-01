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
const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)
const { onMenuToggle } = useLayout()

const selectedTeam = ref<Team | null>(null)
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

const expandedKeys = ref<{ [key: string]: boolean }>({})

function expandAll() {
  for (const node of nodes.value) {
    expandNode(node)
  }
  expandedKeys.value = { ...expandedKeys.value }
}

function collapseAll() {
  expandedKeys.value = {}
}

function expandNode(node: TreeNode) {
  if (!node.children || !node.children.length) return
  expandedKeys.value[node.key] = true
  for (const child of node.children) {
    expandNode(child)
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
  key: () => ['teams', project.value.id],
  query: () => listTeams(project.value.id),
  placeholderData: () => [] as Team[],
})

function selectTeam() {
  if (!teams.value.length) return
  selectedTeam.value = teams.value[0]
}

watch(() => teams.value, selectTeam)

const { data: backlog, isLoading: isBacklogLoading } = useQuery({
  key: () => ['backlog', selectedTeam.value?.id || '', selectedBacklogLevel.value],
  query: async () => getBacklog(selectedTeam.value!.id, undefined, selectedBacklogLevel.value),
  enabled: () => !!selectedTeam.value,
  placeholderData: () => [] as BacklogResponse[],
})

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Backlogs', route: `/projects/${project.value.id}/backlogs` },
  ])
}

onBeforeMount(() => {
  setBreadcrumbs()
  selectTeam()
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
            class="mr-6"
            @click="redirectToBoardView"
          />
        </div>
        <Tabs value="0" class="board-tabs">
          <TabList>
            <Tab value="0">Backlog</Tab>
            <Tab value="1" disabled>Analytics</Tab>
            <div class="ml-auto flex items-center mr-6">
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
          <TabPanels class="!pb-6">
            <TabPanel value="0">
              <TreeTable
                v-model:expanded-keys="expandedKeys"
                :value="nodes"
                :loading="isBacklogLoading"
                scrollable
                scroll-height="calc(100vh - 275px)"
                table-style="min-width: 60rem; width: 100%;"
                class="mt-4"
              >
                <Column style="width: 5%">
                  <template #header>
                    <div class="flex gap-1">
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        severity="secondary"
                        icon="pi pi-plus"
                        v-tooltip.bottom="'Expand All'"
                        @click="expandAll"
                      />
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        severity="secondary"
                        icon="pi pi-minus"
                        v-tooltip.bottom="'Collapse All'"
                        @click="collapseAll"
                      />
                    </div>
                  </template>
                </Column>
                <Column field="type" header="Type" style="width: 10%">
                  <template #body="{ node }">
                    <WorkItemTag :type="node.data.type" />
                  </template>
                </Column>
                <Column expander header="Title" style="width: 30%">
                  <template #body="{ node }">
                    <div
                      class="hover:underline cursor-pointer line-clamp-1"
                      @click="openWorkItemDialog(node.data.id)"
                    >
                      {{ node.data.title }}
                    </div>
                  </template>
                </Column>
                <Column field="status" header="State" style="width: 5%">
                  <template #body="{ node }">
                    <div class="flex items-center gap-2">
                      <Badge :severity="getStatusSeverity(node.data.status)" />
                      {{ getStatusLabel(node.data.status) }}
                    </div>
                  </template>
                </Column>
                <Column field="storyPoints" header="Effort" style="width: 5%" />
                <Column field="valueArea" header="Value Area" style="width: 10%" />
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
