<script setup lang="ts">
import CreateOrganizationDialog from '@/components/CreateOrganizationDialog.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import AppTopbar from '@/layout/AppTopbar.vue'
import { useOrganizationStore } from '@/stores/organization'
import { useProjectStore } from '@/stores/project'
import type { Organization } from '@/types'
import type { MenuItem } from 'primevue/menuitem'
import { computed, onBeforeMount, ref, useTemplateRef, watch } from 'vue'

const organizationStore = useOrganizationStore()
const projectStore = useProjectStore()

type CreateOrganizationDialogType = typeof CreateOrganizationDialog
const createOrganizationDialogRef = useTemplateRef<CreateOrganizationDialogType>(
  'createOrganizationDialogRef',
)

const items = computed<MenuItem[]>(() => [
  {
    label: 'Organizations',
    items: organizationStore.organizations.map((organization) => {
      return {
        id: organization.id,
        label: organization.name,
        command: () => {
          selectedOrganization.value = organization
        },
      }
    }),
  },
])

const selectedOrganization = ref<Organization>()

watch(
  () => selectedOrganization.value,
  (newOrganization) => {
    if (!newOrganization?.id) return
    projectStore.listProjects(newOrganization.id)
  },
)

onBeforeMount(organizationStore.listOrganizations)
</script>

<template>
  <div class="layout-wrapper">
    <div>
      <Menu :model="items">
        <template #end>
          <Button
            label="New Organization"
            class="w-full"
            variant="text"
            icon="pi pi-plus"
            @click="createOrganizationDialogRef?.openDialog"
          />
        </template>
      </Menu>
    </div>
    <div class="layout-content-wrapper">
      <div class="layout-content-wrapper-inside">
        <AppTopbar :show-topbar-left="false" />
        <div class="layout-content">
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
        </div>
      </div>
    </div>
  </div>
  <CreateOrganizationDialog ref="createOrganizationDialogRef" />
</template>

<style>
.p-listbox-list-container {
  max-height: 100% !important;
  overflow-y: auto;
}
</style>
