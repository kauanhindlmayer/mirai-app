<script setup lang="ts">
import CreateOrganizationDialog from '@/components/CreateOrganizationDialog.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { useOrganizationStore } from '@/stores/organization'
import { useProjectStore } from '@/stores/project'
import type { Organization } from '@/types'
import { onBeforeMount, ref, useTemplateRef, watch } from 'vue'

const organizationStore = useOrganizationStore()
const projectStore = useProjectStore()

type CreateOrganizationDialogType = typeof CreateOrganizationDialog
const createOrganizationDialogRef = useTemplateRef<CreateOrganizationDialogType>(
  'createOrganizationDialog',
)

const selectedOrganization = ref<Organization>()

watch(
  () => selectedOrganization.value,
  (newOrganization) => {
    if (!newOrganization?.id) return
    projectStore.listProjects(newOrganization.id)
  },
)

onBeforeMount(async () => {
  await organizationStore.listOrganizations()
  selectedOrganization.value = organizationStore.organizations[0]
})
</script>

<template>
  <header class="flex justify-between items-center">
    <span class="title-h7 my-4">
      {{ selectedOrganization?.name }}
    </span>
    <Button
      label="New Project"
      icon="pi pi-plus"
      @click="createOrganizationDialogRef?.openDialog"
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
        <div v-if="projectStore.projects.length === 0">No projects found.</div>
        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProjectCard
              v-for="project in projectStore.projects"
              :key="project.id"
              :project="project"
            />
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
  <CreateOrganizationDialog ref="createOrganizationDialog" />
</template>
