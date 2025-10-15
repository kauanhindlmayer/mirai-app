<script setup lang="ts">
import ProjectGitHubTab from '~/components/projects/ProjectGitHubTab.vue'
import ProjectOverviewTab from '~/components/projects/ProjectOverviewTab.vue'
import ProjectTeamsTab from '~/components/projects/ProjectTeamsTab.vue'

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)

const pageStore = usePageStore()
pageStore.setTitle('Settings')

const { project } = useProjectContext()

const activeTab = ref('overview')

function setBreadcrumbs(project: Project) {
  pageStore.setBreadcrumbs([
    { label: organization.value.name, route: '/projects' },
    { label: project.name, route: `/projects/${project.id}/summary` },
    { label: 'Settings', route: `/projects/${project.id}/settings` },
  ])
}

onMounted(() => {
  if (!project.value) return
  setBreadcrumbs(project.value)
})
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-6">Project Settings</div>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="overview">
          <i class="pi pi-home mr-2"></i>
          Overview
        </Tab>
        <Tab value="teams">
          <i class="pi pi-users mr-2"></i>
          Teams
        </Tab>
        <Tab value="github">
          <i class="pi pi-github mr-2"></i>
          GitHub Integration
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="overview">
          <ProjectOverviewTab />
        </TabPanel>

        <TabPanel value="teams">
          <ProjectTeamsTab />
        </TabPanel>

        <TabPanel value="github">
          <ProjectGitHubTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
