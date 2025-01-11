<script setup lang="ts">
import EditProjectDialog from '@/components/projects/EditProjectDialog.vue'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useWorkItemStore } from '@/stores/work-item'
import { getInitials } from '@/utils'
import { storeToRefs } from 'pinia'
import { Avatar } from 'primevue'
import { computed, onBeforeMount, ref, useTemplateRef, watch } from 'vue'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)
const pageStore = usePageStore()
const workItemStore = useWorkItemStore()
const { workItemsStats } = storeToRefs(workItemStore)

type EditProjectDialogType = typeof EditProjectDialog
const editProjectDialogRef = useTemplateRef<EditProjectDialogType>('editProjectDialog')

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value!.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value!.id}/summary` },
    { label: 'Summary', route: `/projects/${project.value!.id}/summary` },
  ])
}

const hasProjectDescription = computed(() => project.value?.description)

const selectedPeriod = ref(7)
const periods = ref([
  { label: 'Last 1 day', value: 1 },
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
])

watch(
  () => selectedPeriod.value,
  async (newSelectedPeriod) => {
    await workItemStore.getWorkItemsStats(newSelectedPeriod)
  },
)

onBeforeMount(() => {
  pageStore.setTitle('Summary - Overview')
  setBreadcrumbs()
  workItemStore.getWorkItemsStats(selectedPeriod.value)
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Avatar
              icon="pi pi-user"
              size="xlarge"
              class="mr-4"
              :label="getInitials(project!.name)"
            />
            <div class="font-semibold text-xl">{{ project!.name }}</div>
          </div>
          <Button label="Invite" icon="pi pi-user-plus" />
        </div>
      </div>
    </div>
    <div class="col-span-8">
      <div class="card">
        <div class="flex justify-between items-center">
          <div class="font-semibold text-xl">About this Project</div>
          <Button
            v-if="hasProjectDescription"
            icon="pi pi-pencil"
            severity="secondary"
            variant="text"
            v-tooltip.bottom="'Edit Project Information'"
            @click="editProjectDialogRef?.openDialog"
          />
        </div>
        <div v-if="hasProjectDescription">
          <div>{{ project!.description }}</div>
        </div>
        <div v-else class="flex justify-between items-center">
          <div>
            <div class="font-medium">Help others to get on board!</div>
            <div>Describe your project and make it easier for other people to understand it.</div>
            <Button
              label="Add Project Description"
              icon="pi pi-plus"
              class="mt-4"
              @click="editProjectDialogRef?.openDialog"
            />
          </div>

          <LazyImage class="w-48 mr-4" src="/layout/images/onboarding.svg" alt="Onboarding Image" />
        </div>
      </div>
    </div>
    <div class="col-span-4">
      <div class="card mb-4">
        <div class="flex justify-between items-center mb-4">
          <div class="font-semibold text-xl mr-2">Project Stats</div>
          <Select
            v-model="selectedPeriod"
            :options="periods"
            option-label="label"
            option-value="value"
            class="ml-2"
          />
        </div>
        <div class="font-medium mb-2">Boards</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Button icon="pi pi-file-plus" severity="secondary" />
            <div class="flex flex-col items-start ml-2">
              <div class="text-xl font-semibold">{{ workItemsStats.workItemsCreated }}</div>
              <div class="text-sm text-gray-500">Work Items Created</div>
            </div>
          </div>
          <div class="flex items-center">
            <Button icon="pi pi-file-check" severity="secondary" />
            <div class="flex flex-col items-start ml-2">
              <div class="text-xl font-semibold">{{ workItemsStats.workItemsCompleted }}</div>
              <div class="text-sm text-gray-500">Work Items Completed</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center mb-4">
          <div class="font-semibold text-xl mr-2">Members</div>
          <Badge value="7" severity="secondary" />
        </div>
        <AvatarGroup>
          <Avatar icon="pi pi-user" shape="circle" />
          <Avatar icon="pi pi-user" shape="circle" />
          <Avatar icon="pi pi-user" shape="circle" />
          <Avatar icon="pi pi-user" shape="circle" />
          <Avatar icon="pi pi-user" shape="circle" />
          <Avatar label="+2" shape="circle" />
        </AvatarGroup>
      </div>
    </div>
  </div>
  <EditProjectDialog ref="editProjectDialog" />
</template>
