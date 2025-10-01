<script setup lang="ts">
const { teams, isLoading } = useTeams()
</script>

<template>
  <div class="mt-6">
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <div class="font-semibold text-lg">Teams</div>
        <Button label="New Team" icon="pi pi-plus" size="small" disabled />
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <ProgressSpinner size="50" strokeWidth="4" />
      </div>

      <DataTable v-else-if="teams && teams.length > 0" :value="teams" stripedRows>
        <Column field="name" header="Name">
          <template #body="{ data }">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center space-x-3">
                <Avatar
                  icon="pi pi-users"
                  class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                  size="normal"
                />
                <span class="font-medium">{{ data.name }}</span>
              </div>
              <Tag v-if="data.isDefault" value="Default" severity="secondary" />
            </div>
          </template>
        </Column>
        <Column field="description" header="Description">
          <template #body="{ data }">
            <span
              class="text-surface-600 dark:text-surface-400 block truncate max-w-md"
              :title="data.description"
            >
              {{ data.description || 'No description' }}
            </span>
          </template>
        </Column>
        <Column field="memberCount" header="Members">
          <template #body="{ data }">
            <span class="text-surface-600 dark:text-surface-400">
              {{ data.memberCount || 0 }} members
            </span>
          </template>
        </Column>
      </DataTable>

      <div v-else class="text-center py-12">
        <div class="mb-4">
          <i class="pi pi-users text-4xl text-surface-400 dark:text-surface-600"></i>
        </div>
        <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mb-2">
          No teams found
        </div>
        <div class="text-surface-600 dark:text-surface-400 mb-4">
          Create your first team to start collaborating with your project members.
        </div>
        <Button
          label="Create Team"
          icon="pi pi-plus"
          disabled
          v-tooltip.bottom="'Feature coming soon'"
        />
      </div>
    </div>
  </div>
</template>
