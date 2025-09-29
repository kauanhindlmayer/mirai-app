<script setup lang="ts">
import CreateProjectDrawer from '~/components/projects/CreateProjectDrawer.vue'
import CreateOrganizationDrawer from '~/components/organizations/CreateOrganizationDrawer.vue'

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)

const pageStore = usePageStore()
pageStore.setTitle('Projects - Home')
pageStore.resetBreadcrumbs()

const createProjectDrawerRef =
  useTemplateRef<InstanceType<typeof CreateProjectDrawer>>('createProjectDrawer')

const createOrganizationDrawerRef = useTemplateRef<InstanceType<typeof CreateOrganizationDrawer>>(
  'createOrganizationDrawer',
)

const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
  key: () => ['organizations'],
  query: () => listOrganizations(),
  placeholderData: () => [] as Organization[],
})

const { data: projects, isLoading } = useQuery({
  key: () => ['projects', organization.value.id],
  query: () => listProjects(organization.value.id),
  enabled: () => !!organization.value.id,
})

function selectFirstOrganization() {
  if (!organizations.value || organizations.value.length === 0) return
  organization.value = organizations.value[0]
}

watch(() => organizations.value, selectFirstOrganization)

onMounted(selectFirstOrganization)
</script>

<template>
  <header class="flex justify-between items-center">
    <div class="flex items-center space-x-1">
      <Select
        v-model="organization"
        :options="organizations"
        :loading="isLoadingOrganizations"
        class="my-4"
        option-label="name"
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
        v-tooltip.bottom="'Organization Settings'"
        @click="$router.push(`/organizations/${organization.id}/settings`)"
      />
    </div>
    <Button label="New Project" icon="pi pi-plus" @click="createProjectDrawerRef?.showDrawer" />
  </header>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Projects</Tab>
      <Tab value="1" disabled>My Work Items</Tab>
      <Tab value="2" disabled>My Pull Requests</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <div v-if="isLoading">Loading projects...</div>
        <div v-else-if="projects?.length">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
          </div>
        </div>
        <div v-else>No projects found.</div>
      </TabPanel>
    </TabPanels>
  </Tabs>
  <CreateProjectDrawer ref="createProjectDrawer" />
  <CreateOrganizationDrawer ref="createOrganizationDrawer" />
</template>
