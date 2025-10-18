<script setup lang="ts">
import AddUserToProjectDrawer from '~/components/projects/AddUserToProjectDrawer.vue'
import EditProjectDrawer from '~/components/projects/EditProjectDrawer.vue'

const pageStore = usePageStore()
pageStore.setTitle('Summary - Overview')

const editProjectDrawerRef =
  useTemplateRef<InstanceType<typeof EditProjectDrawer>>('editProjectDrawer')
const addUserDrawerRef =
  useTemplateRef<InstanceType<typeof AddUserToProjectDrawer>>('addUserDrawer')

const periods = ref([
  { label: 'Last 1 day', value: 1 },
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
])

const { stats, periodInDays: selectedPeriod } = useWorkItemsStats()

const { organization } = useOrganizationContext()
const { project, isLoading, isPending } = useProjectContext()

const isLoadingProject = computed(() => isLoading.value || isPending.value)

const { data: members } = useQuery({
  key: () => ['project-users', organization.value.id, project.value.id],
  query: () => getProjectUsers(organization.value.id, project.value.id, undefined, 1, 6),
  enabled: () => !!organization.value.id && !!project.value.id,
})

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: organization.value.name, route: '/projects' },
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value.id}/summary` },
    { label: 'Summary', route: `/projects/${project.value.id}/summary` },
  ])
}

watch([organization, project], setBreadcrumbs, { immediate: true })
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card !p-4">
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
          <Button label="Invite" icon="pi pi-user-plus" @click="addUserDrawerRef?.showDrawer" />
        </div>
      </div>
    </div>
    <div class="col-span-12 md:col-span-8">
      <div class="card">
        <div class="flex justify-between items-center">
          <div class="font-semibold text-xl">About this Project</div>
          <Button
            v-if="!isLoadingProject"
            icon="pi pi-pencil"
            severity="secondary"
            variant="text"
            v-tooltip.bottom="'Edit Project Information'"
            @click="editProjectDrawerRef?.showDrawer"
          />
        </div>
        <div v-if="isLoadingProject || project.description">
          <div>{{ project.description }}</div>
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
      <div class="card !mb-4">
        <div class="flex justify-between items-center">
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
              <div class="text-xl font-semibold">{{ stats?.workItemsCreated }}</div>
              <div class="text-sm text-gray-500">Work Items Created</div>
            </div>
          </div>
          <div class="flex items-center">
            <Button icon="pi pi-file-check" severity="secondary" />
            <div class="flex flex-col items-start ml-2">
              <div class="text-xl font-semibold">{{ stats?.workItemsCompleted }}</div>
              <div class="text-sm text-gray-500">Work Items Completed</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center mb-4">
          <div class="font-semibold text-xl mr-2">Members</div>
          <Badge :value="members?.totalCount" severity="secondary" />
        </div>
        <AvatarGroup v-if="members?.items.length">
          <Avatar
            v-for="member in members?.items"
            :image="member.imageUrl"
            :icon="!member.imageUrl ? 'pi pi-user' : undefined"
            :key="member.id"
            shape="circle"
            v-tooltip.bottom="member.fullName"
          />
          <Avatar
            v-if="members?.hasNextPage"
            :label="`+${members?.totalCount - members?.items.length}`"
            shape="circle"
          />
        </AvatarGroup>
        <div v-else class="text-surface-500">No members in this project</div>
      </div>
    </div>
  </div>
  <EditProjectDrawer ref="editProjectDrawer" />
  <AddUserToProjectDrawer ref="addUserDrawer" />
</template>
