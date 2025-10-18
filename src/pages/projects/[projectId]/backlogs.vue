<script setup lang="ts">
import type { TreeNode } from 'primevue/treenode'
import { formatEnumOptions } from '~/utils'

const pageStore = usePageStore()
pageStore.setTitle('Backlogs - Boards')

const { project } = useProjectContext()

const { onMenuToggle } = useLayout()

const { selectedTeam, teams, isLoadingTeams } = useTeamSelection()
const selectedBacklogLevel = ref(BacklogLevel.Feature)
const backlogLevelOptions = formatEnumOptions(BacklogLevel)

watch(
  () => selectedTeam.value,
  async (newSelectedTeam) => {
    if (!newSelectedTeam) return
    const backlogLevelName = getBacklogLevelLabel(selectedBacklogLevel.value)
    pageStore.setTitle(`${selectedTeam.value?.name} ${backlogLevelName} Backlog - Boards`)
  },
)

const nodes = computed(() => backlog.value?.map(toNode) ?? [])

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

watch(project, setBreadcrumbs, { immediate: true })
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
                :options="backlogLevelOptions"
                option-label="label"
                option-value="value"
                class="ml-2"
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
