<script setup lang="ts">
import CreateProjectDialog from '@/components/projects/CreateProjectDialog.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import { useOrganizationStore } from '@/stores/organization'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import type { Organization } from '@/types/organization'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref, useTemplateRef, watch } from 'vue'

const organizationStore = useOrganizationStore()
const { organizations } = storeToRefs(organizationStore)
const projectStore = useProjectStore()
const pageStore = usePageStore()

type CreateProjectDialogType = typeof CreateProjectDialog
const createProjectDialogRef = useTemplateRef<CreateProjectDialogType>('createProjectDialog')

const selectedOrganization = ref<Organization>()

watch(
  () => selectedOrganization.value,
  (newOrganization) => {
    if (!newOrganization?.id) return
    projectStore.listProjects(newOrganization.id)
    organizationStore.setOrganizationId(newOrganization.id)
  },
)

onBeforeMount(async () => {
  await organizationStore.listOrganizations()
  selectedOrganization.value = organizationStore.organizations[0]
  pageStore.setTitle('Projects - Home')
})
</script>

<template>
  <header class="flex justify-between items-center">
    <Select
      v-model="selectedOrganization"
      :options="organizations"
      class="my-4"
      option-label="name"
    />
    <Button label="New Project" icon="pi pi-plus" @click="createProjectDialogRef?.openDialog" />
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
  <CreateProjectDialog ref="createProjectDialog" />
</template>
