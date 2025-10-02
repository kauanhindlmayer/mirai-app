<script setup lang="ts">
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue'
import { useOrganizationUsers } from '~/queries/organizations'
import AddUserToOrganizationDrawer from './AddUserToOrganizationDrawer.vue'

const { users, filters, isLoading } = useOrganizationUsers()

const addUserDrawerRef =
  useTemplateRef<InstanceType<typeof AddUserToOrganizationDrawer>>('addUserDrawer')

function onPaginate(event: DataTablePageEvent) {
  filters.value.page = event.page + 1
  filters.value.pageSize = event.rows
}

function onSort(event: DataTableSortEvent) {
  const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc'
  filters.value.sort = `${event.sortField} ${sortOrder}`
}

function addUser() {
  addUserDrawerRef.value?.showDrawer()
}
</script>

<template>
  <div class="mt-6">
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <div class="font-semibold text-lg">Organization Users</div>
        <Button label="Add User" icon="pi pi-plus" size="small" @click="addUser" />
      </div>

      <DataTable
        :value="users?.items || []"
        :rows="filters.pageSize"
        :total-records="users?.totalCount || 0"
        :rows-per-page-options="[5, 10, 20, 50]"
        :loading="isLoading"
        :page-count="users?.totalPages || 0"
        lazy
        paginator
        stripedRows
        @sort="onSort"
        @page="onPaginate"
      >
        <Column field="fullName" header="Name" sortable>
          <template #body="{ data }">
            <div class="flex items-center space-x-3">
              <Avatar v-if="data.imageUrl" :image="data.imageUrl" pt:image:class="rounded-lg!" />
              <Avatar
                v-else
                :label="data.fullName.charAt(0)"
                class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-avatar"
              />
              <div>
                <div class="font-medium">{{ data.fullName }}</div>
                <div class="text-sm text-surface-600 dark:text-surface-400">
                  {{ data.email }}
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column field="role" header="Role">
          <template #body>
            <Tag value="Member" severity="secondary" />
          </template>
        </Column>
        <Column field="lastActiveAtUtc" header="Last Active" sortable>
          <template #body="{ data }">
            <span class="text-surface-600 dark:text-surface-400">
              {{ data.lastActiveAtUtc ? formatDistanceToNow(data.lastActiveAtUtc) : '' }}
            </span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body>
            <div class="flex space-x-2">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                size="small"
                v-tooltip.bottom="'Edit User'"
                disabled
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                size="small"
                v-tooltip.bottom="'Remove User'"
                disabled
              />
            </div>
          </template>
        </Column>
        <template #empty>
          <div v-if="!isLoading" class="text-center py-12">
            <div class="mb-4">
              <i class="pi pi-users text-4xl text-surface-400 dark:text-surface-600"></i>
            </div>
            <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mb-2">
              No users found
            </div>
            <div class="text-surface-600 dark:text-surface-400 mb-4">
              Add users to your organization to start collaborating.
            </div>
            <Button label="Add User" icon="pi pi-plus" @click="addUser" />
          </div>
        </template>
      </DataTable>
    </div>

    <AddUserToOrganizationDrawer ref="addUserDrawer" />
  </div>
</template>
