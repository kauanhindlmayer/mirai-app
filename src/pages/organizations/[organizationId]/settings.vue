<script setup lang="ts">
import OrganizationUsersTab from '~/components/organizations/OrganizationUsersTab.vue'

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)

const pageStore = usePageStore()
pageStore.setTitle('Organization Settings')

const activeTab = ref('users')

function setBreadcrumbs(organization: Organization) {
  pageStore.setBreadcrumbs([
    { label: organization.name, route: '/projects' },
    { label: 'Settings', route: `/organizations/${organization.id}/settings` },
  ])
}

onMounted(() => {
  if (!organization.value) return
  setBreadcrumbs(organization.value)
})
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
