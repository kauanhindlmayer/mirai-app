<script setup lang="ts">
import AppTag from '@/components/tags/AppTag.vue'
import { displayError } from '@/composables/displayError'
import { useAppToast } from '@/composables/useAppToast'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useWorkItemStore } from '@/stores/work-item'
import type { PaginationFilter } from '@/types'
import type { Tag } from '@/types/tag'
import { type WorkItem } from '@/types/work-item'
import { formatDate } from '@/utils/date'
import { getStatusLabel, getStatusSeverity, getTypeLabel, getTypeSeverity } from '@/utils/work-item'
import { storeToRefs } from 'pinia'
import {
  type ContextMenu,
  type DataTablePageEvent,
  type DataTableRowContextMenuEvent,
  type DataTableSortEvent,
} from 'primevue'
import { onMounted, ref, useTemplateRef } from 'vue'

const toast = useAppToast()

const pageStore = usePageStore()
const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)
const workItemStore = useWorkItemStore()
const { workItems } = storeToRefs(workItemStore)

const selectedWorkItem = ref<WorkItem | null>(null)

const menuRef = useTemplateRef<InstanceType<typeof ContextMenu>>('menu')
const items = [
  {
    label: 'Copy to Clipboard',
    icon: 'pi pi-fw pi-clipboard',
    command: copyWorkItemToClipboard,
  },
  {
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    command: deleteWorkItem,
  },
]

function copyWorkItemToClipboard() {
  if (!selectedWorkItem.value) return
  const header = 'ID\tType\tTitle\tState'
  const { code, type, title, status } = selectedWorkItem.value
  const workItemDataString = `${code}\t${getTypeLabel(type)}\t${title}\t${getStatusLabel(status)}`
  const workItemString = [header, workItemDataString].join('\n')
  navigator.clipboard.writeText(workItemString).then(() => {
    toast.showSuccess({
      summary: 'Work Item Copied',
      detail: 'Work item data copied to clipboard',
    })
  })
  clearSelectedWorkItem()
}

async function deleteWorkItem() {
  if (!selectedWorkItem.value?.id) return
  await workItemStore.deleteWorkItem(selectedWorkItem.value.id)
  clearSelectedWorkItem()
}

function onRowContextMenu(event: DataTableRowContextMenuEvent) {
  menuRef.value?.show(event.originalEvent)
}

function clearSelectedWorkItem() {
  selectedWorkItem.value = null
}

const isLoading = ref(false)

async function listWorkItems() {
  isLoading.value = true
  try {
    await workItemStore.listWorkItems(filters.value)
  } catch (error) {
    displayError(error)
  } finally {
    isLoading.value = false
  }
}

const filters = ref<PaginationFilter>({
  pageNumber: 1,
  pageSize: 10,
  sortField: 'updatedAt',
  sortOrder: 'desc',
})

async function onSort(event: DataTableSortEvent) {
  filters.value.sortField = event.sortField as string
  filters.value.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc'
  await listWorkItems()
}

async function onPaginate(event: DataTablePageEvent) {
  filters.value.pageNumber = event.page + 1
  filters.value.pageSize = event.rows
  await listWorkItems()
}

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value!.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value!.id}/work-items` },
    { label: 'Work Items', route: `/projects/${project.value!.id}/work-items` },
  ])
}

function getMoreTagsTooltip(tags: Tag[]) {
  return tags
    .slice(2)
    .map((tag) => tag.name)
    .join(', ')
}

onMounted(async () => {
  await listWorkItems()
  pageStore.setTitle('Work Items - Boards')
  setBreadcrumbs()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="font-semibold text-xl mb-4">Work Items</div>
        <ContextMenu ref="menu" :model="items" @hide="clearSelectedWorkItem" />
        <DataTable
          v-model:context-menu-selection="selectedWorkItem"
          :value="workItems.items"
          :rows="filters.pageSize"
          :total-records="workItems.totalCount"
          :rows-per-page-options="[5, 10, 20, 50]"
          :loading="isLoading"
          :page-count="workItems.totalPages"
          lazy
          paginator
          table-style="min-width: 50rem"
          context-menu
          @sort="onSort"
          @page="onPaginate"
          @row-contextmenu="onRowContextMenu"
        >
          <Column field="code" header="ID" sortable />
          <Column field="type" header="Type" sortable>
            <template #body="{ data }">
              <Tag :value="getTypeLabel(data.type)" :severity="getTypeSeverity(data.type)" />
            </template>
          </Column>
          <Column field="title" header="Title" sortable />
          <Column field="assignedTo" header="Assigned To">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Avatar shape="circle" icon="pi pi-user" />
                {{ data.assignedTo ? data.assignedTo.name : 'Unassigned' }}
              </div>
            </template>
          </Column>
          <Column field="status" header="State" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Badge :severity="getStatusSeverity(data.status)" />
                {{ getStatusLabel(data.status) }}
              </div>
            </template>
          </Column>
          <Column field="tags" header="Tags">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <template v-for="tag in data.tags.slice(0, 2)" :key="tag.name">
                  <AppTag :color="tag.color" :label="tag.name" />
                </template>
                <span v-if="data.tags.length > 2" v-tooltip.bottom="getMoreTagsTooltip(data.tags)">
                  ...
                </span>
              </div>
            </template>
          </Column>
          <Column header="Activity Date" sortable>
            <template #body="{ data }">
              {{ formatDate(data.updatedAt ?? data.createdAt, 'MM/dd/yyyy hh:mm') }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
