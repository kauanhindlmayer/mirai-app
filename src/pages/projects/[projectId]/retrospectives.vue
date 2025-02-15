<script lang="ts" setup>
import { useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import { getRetrospective, listRetrospectives } from '~/api/retrospectives'
import CreateRetrospectiveDialog from '~/components/retrospectives/CreateRetrospectiveDialog.vue'
import RetrospectiveBoard from '~/components/retrospectives/RetrospectiveBoard.vue'
import { useTeams } from '~/queries/teams'
import { usePageStore } from '~/stores/page'
import { useProjectStore } from '~/stores/project'
import { useTeamStore } from '~/stores/team'
import type { RetrospectiveSummary } from '~/types/retrospective'
import type { Team } from '~/types/team'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

const pageStore = usePageStore()
pageStore.setTitle('Retrospectives - Boards')

const selectedTeam = ref<Team | null>(null)
const selectedRetrospective = ref<RetrospectiveSummary | null>(null)

const { data: retrospectives, isLoading } = useQuery({
  key: () => ['retrospectives', teamId.value!],
  query: () => listRetrospectives(teamId.value!),
  enabled: () => !!teamId.value,
  placeholderData: () => [] as RetrospectiveSummary[],
})

watch(
  () => selectedTeam.value,
  (newSelectedTeam) => {
    if (!newSelectedTeam) return
    teamStore.setTeamId(newSelectedTeam.id)
  },
)

const { data: retrospective } = useQuery({
  key: () => ['retrospective', selectedRetrospective.value?.id ?? ''],
  query: async () => getRetrospective(teamId.value!, selectedRetrospective.value?.id ?? ''),
  enabled: () => !!selectedRetrospective.value,
})

watch(() => retrospectives.value, selectFirstRetrospective)

function selectFirstRetrospective() {
  if (!retrospectives.value.length) return
  selectedRetrospective.value = retrospectives.value[0]
}

const { teams, isLoading: isLoadingTeams } = useTeams()

watch(() => teams.value, selectFirstTeam)

function selectFirstTeam() {
  if (!teams.value.length) return
  selectedTeam.value = teams.value[0]
}

watch(
  () => selectedTeam.value,
  async (newSelectedTeam) => {
    if (!newSelectedTeam) return
    teamStore.setTeamId(newSelectedTeam.id)
  },
)

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Retrospectives', route: `/projects/${project.value.id}/retrospectives` },
  ])
}

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  {
    label: 'Create New Retrospective',
    icon: 'pi pi-plus',
    command: () => createRetrospectiveDialogRef.value?.showDialog(),
  },
  { label: 'Edit Retrospective', icon: 'pi pi-pencil', disabled: true },
  { label: 'Copy Retrospective Link', icon: 'pi pi-link', disabled: true },
  { label: 'Delete Retrospective', icon: 'pi pi-trash', disabled: true },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

const createRetrospectiveDialogRef = useTemplateRef<InstanceType<typeof CreateRetrospectiveDialog>>(
  'createRetrospectiveDialog',
)

onBeforeMount(() => {
  setBreadcrumbs()
  selectFirstTeam()
  selectFirstRetrospective()
})
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
              :loading="isLoadingTeams"
              option-label="name"
            />
            <Button
              icon="pi pi-users"
              severity="secondary"
              text
              v-tooltip.bottom="'Show Team Profile'"
            />
          </div>
        </div>

        <Tabs value="0" class="board-tabs">
          <TabList>
            <Tab value="0">Board</Tab>
            <Tab value="1" disabled>History</Tab>
            <div class="ml-auto flex items-center">
              <Select
                v-model="selectedRetrospective"
                :options="retrospectives"
                :loading="isLoading"
                option-label="title"
                class="mx-2"
              />
              <Button
                icon="pi pi-ellipsis-h"
                severity="secondary"
                v-tooltip.bottom="'Board Actions'"
                text
                @click="toggleMenuItems"
              />
              <Menu ref="menu" popup :model="menuItems" />
            </div>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <RetrospectiveBoard v-if="retrospective" :retrospective="retrospective" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
  <CreateRetrospectiveDialog ref="createRetrospectiveDialog" />
</template>

<style>
.board-tabs .p-tablist-tab-list {
  border: none !important;
}
.board-tabs .p-tab.p-disabled {
  border: none !important;
}
</style>
