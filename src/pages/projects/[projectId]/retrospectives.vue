<script lang="ts" setup>
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import RetrospectiveDialog from '~/components/retrospectives/RetrospectiveDialog.vue'

const pageStore = usePageStore()
pageStore.setTitle('Retrospectives - Boards')

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

const selectedTeam = ref<Team | null>(null)
const selectedRetrospective = ref<RetrospectiveSummary | null>(null)
const retrospectiveId = computed(() => selectedRetrospective.value?.id ?? '')

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
  key: () => ['retrospective', retrospectiveId.value],
  query: async () => getRetrospective(teamId.value!, retrospectiveId.value),
  enabled: () => !!selectedRetrospective.value,
})

const componentKey = ref(0)

watch(() => retrospective.value, forceRerender)

function forceRerender() {
  componentKey.value += 1
}

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

const retrospectiveDialogRef =
  useTemplateRef<InstanceType<typeof RetrospectiveDialog>>('retrospectiveDialog')
const retrospectiveToEdit = ref<Retrospective | undefined>(undefined)

function openCreateRetrospectiveDialog() {
  retrospectiveToEdit.value = undefined
  retrospectiveDialogRef.value?.showDialog()
}

function openEditRetrospectiveDialog() {
  retrospectiveToEdit.value = retrospective.value
  retrospectiveDialogRef.value?.showDialog()
}

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  {
    label: 'Create New Retrospective',
    icon: 'pi pi-plus',
    command: openCreateRetrospectiveDialog,
  },
  {
    label: 'Edit Retrospective',
    icon: 'pi pi-pencil',
    command: openEditRetrospectiveDialog,
  },
  {
    label: 'Copy Retrospective Link',
    icon: 'pi pi-link',
    command: copyRetrospectiveLink,
  },
  {
    label: 'Delete Retrospective',
    icon: 'pi pi-trash',
    disabled: true,
  },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

const toast = useAppToast()

function copyRetrospectiveLink() {
  navigator.clipboard.writeText(window.location.href)
  toast.showSuccess({ detail: `The link to the retrospective has been copied to the clipboard` })
}

const retrospectiveHub = useSignalR('/hubs/retrospective')
const queryCache = useQueryCache()

function invalidateRetrospectiveQuery() {
  queryCache.invalidateQueries({ key: ['retrospective', retrospectiveId.value] })
}

async function initializeRetrospectiveHub() {
  await retrospectiveHub.startConnection()
  retrospectiveHub.on('send-retrospective-item', invalidateRetrospectiveQuery)
  retrospectiveHub.on('delete-retrospective-item', invalidateRetrospectiveQuery)
}

onBeforeMount(async () => {
  setBreadcrumbs()
  selectFirstTeam()
  selectFirstRetrospective()
  await initializeRetrospectiveHub()
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
        </div>

        <Tabs value="0" class="board-tabs">
          <TabList>
            <Tab value="0">Board</Tab>
            <Tab value="1" disabled>History</Tab>
            <div v-if="retrospectives.length" class="ml-auto flex items-center mr-6">
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
            <TabPanel value="0" class="min-h-[calc(100vh-234px)]">
              <RetrospectiveBoard
                v-if="retrospective"
                :retrospective="retrospective"
                :key="componentKey"
              />
              <div v-else class="flex flex-col items-center mt-16">
                <h2 class="text-xl font-semibold">Get started with your first Retrospective</h2>
                <p>Create a new board to start collecting feedback and insights.</p>
                <Button
                  icon="pi pi-plus"
                  label="Create Board"
                  severity="primary"
                  class="mt-4"
                  @click="openCreateRetrospectiveDialog"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
  <RetrospectiveDialog ref="retrospectiveDialog" :retrospective="retrospectiveToEdit" />
</template>
