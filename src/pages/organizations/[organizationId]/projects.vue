<script setup lang="ts">
import CreateOrganizationDrawer from '~/components/organizations/CreateOrganizationDrawer.vue'
import CreateProjectDrawer from '~/components/projects/CreateProjectDrawer.vue'

const pageStore = usePageStore()
pageStore.setTitle('Projects - Home')
pageStore.resetBreadcrumbs()

const createProjectDrawerRef =
  useTemplateRef<InstanceType<typeof CreateProjectDrawer>>('createProjectDrawer')

const createOrganizationDrawerRef = useTemplateRef<InstanceType<typeof CreateOrganizationDrawer>>(
  'createOrganizationDrawer',
)

const route = useRoute('/organizations/[organizationId]/projects')
const router = useRouter()
const { organization, setOrganization } = useOrganizationContext()

const isOrganizationSelected = computed(() => !!organization.value?.id)
const hasNoOrganizations = computed(
  () => !isLoadingOrganizations.value && organizations.value?.length === 0,
)
const hasNoProjects = computed(() => !isLoadingProjects.value && projects.value?.length === 0)

const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
  key: () => ['organizations'],
  query: () => listOrganizations(),
  placeholderData: () => [] as Organization[],
})

const { data: projects, isLoading: isLoadingProjects } = useQuery({
  key: () => ['projects', organization.value.id],
  query: () => listProjects(organization.value.id),
  enabled: () => !!organization.value.id,
})

function handleOrganizationSelection() {
  if (!organizations.value?.length) return

  const routeOrganizationId = route.params.organizationId
  const isDefaultRoute = !routeOrganizationId || routeOrganizationId === 'default'

  if (isDefaultRoute) {
    const firstOrganization = organizations.value[0]
    setOrganization(firstOrganization)
    router.replace(`/organizations/${firstOrganization.id}/projects`)
    return
  }

  if (routeOrganizationId !== organization.value?.id) {
    const routeOrganization = organizations.value.find((org) => org.id === routeOrganizationId)
    if (routeOrganization) setOrganization(routeOrganization)
  }
}

watch(organizations, handleOrganizationSelection, { immediate: true })
</script>

<template>
  <header class="flex justify-between items-center">
    <div class="flex items-center space-x-1">
      <Select
        :model-value="organization"
        :options="organizations"
        :loading="isLoadingOrganizations"
        placeholder="Select an organization..."
        class="my-4"
        option-label="name"
        @update:model-value="setOrganization"
      >
        <template #footer>
          <div class="p-1">
            <Button
              label="New Organization"
              fluid
              severity="secondary"
              text
              size="small"
              icon="pi pi-plus"
              @click="createOrganizationDrawerRef?.showDrawer"
            />
          </div>
        </template>
      </Select>
      <Button
        icon="pi pi-cog"
        severity="secondary"
        text
        :disabled="!isOrganizationSelected"
        v-tooltip.bottom="'Organization Settings'"
        @click="$router.push(`/organizations/${organization.id}/settings`)"
      />
    </div>
    <Button
      label="New Project"
      icon="pi pi-plus"
      :disabled="!isOrganizationSelected"
      @click="createProjectDrawerRef?.showDrawer"
    />
  </header>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Projects</Tab>
      <Tab value="1" disabled>My Work Items</Tab>
      <Tab value="2" disabled>My Pull Requests</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <EmptyState
          v-if="hasNoOrganizations"
          icon="pi pi-building"
          title="No organizations found"
          message="Create an organization to start managing projects with your team."
        />

        <div
          v-else-if="isLoadingProjects"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
        >
          <ProjectCardSkeleton v-for="i in 8" :key="i" />
        </div>

        <EmptyState
          v-else-if="hasNoProjects"
          icon="pi pi-folder-open"
          title="No projects found"
          message="Create a project to plan and track work with your team."
        />

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
  <CreateProjectDrawer ref="createProjectDrawer" />
  <CreateOrganizationDrawer ref="createOrganizationDrawer" />
</template>
