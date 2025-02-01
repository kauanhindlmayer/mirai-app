<script setup lang="ts">
import { getProject } from '@/api/projects'
import LazyImage from '@/components/common/LazyImage.vue'
import EditProjectDrawer from '@/components/projects/EditProjectDrawer.vue'
import { useWorkItemsStats } from '@/queries/work-items'
import { usePageStore } from '@/stores/page'
import type { Project } from '@/types/project'
import { getInitials } from '@/utils'
import { useQuery } from '@pinia/colada'
import { Avatar } from 'primevue'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const pageStore = usePageStore()
pageStore.setTitle('Summary - Overview')

const editProjectDrawerRef =
  useTemplateRef<InstanceType<typeof EditProjectDrawer>>('editProjectDrawer')

function setBreadcrumbs(project: Project) {
  pageStore.setBreadcrumbs([
    { label: project.name, route: `/projects/${project.id}/summary` },
    { label: 'Overview', route: `/projects/${project.id}/summary` },
    { label: 'Summary', route: `/projects/${project.id}/summary` },
  ])
}

const hasProjectDescription = computed(() => project.value?.description)

const periods = ref([
  { label: 'Last 1 day', value: '1' },
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
])

const { stats, periodInDays } = useWorkItemsStats()

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

const { data: project, isLoading } = useQuery({
  key: () => ['project', projectId.value],
  query: () => getProject(projectId.value),
  placeholderData: {} as Project,
})

watch(() => project.value, setBreadcrumbs)
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div v-if="isLoading" class="card p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Skeleton size="4rem" class="mr-4" />
            <Skeleton width="10rem" height="1.5rem" />
          </div>
          <Skeleton width="6rem" height="2.5rem" />
        </div>
      </div>
      <div v-else class="card p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Avatar
              icon="pi pi-user"
              size="xlarge"
              class="mr-4"
              :label="getInitials(project.name)"
            />
            <div class="font-semibold text-2xl">{{ project.name }}</div>
          </div>
          <Button label="Invite" icon="pi pi-user-plus" />
        </div>
      </div>
    </div>
    <div class="col-span-12 md:col-span-8">
      <div class="card">
        <div class="flex justify-between items-center">
          <div class="font-semibold text-xl">About this Project</div>
          <Button
            v-if="hasProjectDescription"
            icon="pi pi-pencil"
            severity="secondary"
            variant="text"
            v-tooltip.bottom="'Edit Project Information'"
            @click="editProjectDrawerRef?.showDrawer"
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
              @click="editProjectDrawerRef?.showDrawer"
            />
          </div>
          <LazyImage class="w-48 mr-4" src="/layout/images/onboarding.svg" alt="Onboarding Image" />
        </div>
      </div>
    </div>
    <div class="col-span-12 md:col-span-4">
      <div class="card mb-4">
        <div class="flex justify-between items-center mb-4">
          <div class="font-semibold text-xl mr-2">Project Stats</div>
          <Select
            v-model="periodInDays"
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
              <div class="text-xl font-semibold">{{ stats.workItemsCreated }}</div>
              <div class="text-sm text-gray-500">Work Items Created</div>
            </div>
          </div>
          <div class="flex items-center">
            <Button icon="pi pi-file-check" severity="secondary" />
            <div class="flex flex-col items-start ml-2">
              <div class="text-xl font-semibold">{{ stats.workItemsCompleted }}</div>
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
  <EditProjectDrawer ref="editProjectDrawer" />
</template>
