<script setup lang="ts">
import { listOrganizations } from '@/api/organizations'
import { listProjects } from '@/api/projects'
import CreateProjectDrawer from '@/components/projects/CreateProjectDrawer.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import { useOrganizationStore } from '@/stores/organization'
import { usePageStore } from '@/stores/page'
import type { Organization } from '@/types/organization'
import type { Project } from '@/types/project'
import { useQuery } from '@pinia/colada'
import { ref, useTemplateRef } from 'vue'

const organizationStore = useOrganizationStore()
const pageStore = usePageStore()
pageStore.setTitle('Projects - Home')

const createProjectDrawerRef =
  useTemplateRef<InstanceType<typeof CreateProjectDrawer>>('createProjectDrawer')

const selectedOrganization = ref<Organization | null>(null)

const { data: organizations, isLoading } = useQuery({
  key: () => ['organizations'],
  query: async () => {
    const organizations = await listOrganizations()
    if (organizations.length) {
      const [firstOrganization] = organizations
      selectedOrganization.value = firstOrganization
      organizationStore.setOrganization(firstOrganization)
    }
    return organizations
  },
})

const { data: projects } = useQuery({
  key: () => ['projects', organizationStore.organizationId],
  query: () => listProjects(organizationStore.organizationId),
  enabled: () => !!organizationStore.organizationId,
  placeholderData: [] as Project[],
})
</script>

<template>
  <header class="flex justify-between items-center">
    <div class="flex items-center space-x-1">
      <Select
        v-model="selectedOrganization"
        :options="organizations"
        :loading="isLoading"
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
            />
          </div>
        </template>
      </Select>
      <Button
        icon="pi pi-cog"
        severity="secondary"
        text
        v-tooltip.bottom="'Organization Settings'"
        @click="createProjectDrawerRef?.openDrawer"
      />
    </div>
    <Button label="New Project" icon="pi pi-plus" @click="createProjectDrawerRef?.openDrawer" />
  </header>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Projects</Tab>
      <Tab value="1" disabled>My Work Items</Tab>
      <Tab value="2" disabled>My Pull Requests</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <div v-if="projects.length === 0">No projects found.</div>
        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
  <CreateProjectDrawer ref="createProjectDrawer" />
</template>
