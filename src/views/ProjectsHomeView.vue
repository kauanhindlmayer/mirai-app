<script setup lang="ts">
import CreateOrganizationDialog from '@/components/CreateOrganizationDialog.vue';
import AppTopbar from '@/layout/AppTopbar.vue';
import { useOrganizationStore } from '@/stores/organization';
import { useProjectStore } from '@/stores/project';
import type { MenuItem } from 'primevue/menuitem';
import { computed, onBeforeMount, ref, useTemplateRef, watch } from 'vue';

const organizationStore = useOrganizationStore();
const projectStore = useProjectStore();

type CreateOrganizationDialogType = typeof CreateOrganizationDialog;
const createOrganizationDialogRef =
    useTemplateRef<CreateOrganizationDialogType>(
        'createOrganizationDialogRef'
    );

const items = computed<MenuItem[]>(() => [
    {
        label: 'Organizations',
        items: organizationStore.organizations.map((organization) => {
            return {
                id: organization.id,
                label: organization.name
            };
        })
    }
]);

const selectedOrganization = ref<MenuItem>({});

watch(
    () => selectedOrganization.value,
    (newOrganization) => {
        if (!newOrganization.id) return;
        projectStore.listProjects(newOrganization.id);
    }
);

onBeforeMount(organizationStore.listOrganizations);
</script>

<template>
    <AppTopbar :show-topbar-left="false" />
    <div class="flex gap-4">
        <Listbox
            v-model="selectedOrganization"
            :options="items"
            option-label="label"
            option-group-label="label"
            option-group-children="items"
        />

        <div class="w-full p-4">
            <header class="flex justify-between items-center">
                <div>{{ selectedOrganization.label }}</div>
                <div>
                    <Button
                        label="New Project"
                        icon="pi pi-plus"
                        @click="createOrganizationDialogRef?.openDialog"
                    />
                </div>
            </header>
            <Tabs value="0">
                <TabList>
                    <Tab value="0">Projects</Tab>
                    <Tab value="1" disabled>My Work Items</Tab>
                    <Tab value="2" disabled>My Pull Requests</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div v-if="projectStore.projects.length === 0">
                            No projects found.
                        </div>
                        <pre v-else> {{ projectStore.projects }} </pre>
                    </TabPanel>
                </TabPanels>
            </Tabs>
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
