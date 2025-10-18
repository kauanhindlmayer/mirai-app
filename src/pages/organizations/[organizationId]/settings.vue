<script setup lang="ts">
import OrganizationUsersTab from '~/components/organizations/OrganizationUsersTab.vue'

const pageStore = usePageStore()
pageStore.setTitle('Organization Settings')

const { organization } = useOrganizationContext()

const activeTab = ref('users')

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: organization.value.name, route: '/projects' },
    { label: 'Settings', route: `/organizations/${organization.value.id}/settings` },
  ])
}

watch(organization, setBreadcrumbs, { immediate: true })
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-6">Organization Settings</div>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="users">
          <i class="pi pi-users mr-2"></i>
          Users
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="users">
          <OrganizationUsersTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
