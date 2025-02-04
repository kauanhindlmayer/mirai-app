<script setup lang="ts">
import { deleteWorkItem as _deleteWorkItem, listWorkItems } from '@/api/work-items'
import AppTag from '@/components/tags/AppTag.vue'
import WorkItemTag from '@/components/work-items/WorkItemTag.vue'
import { displayError } from '@/composables/displayError'
import { useAppToast } from '@/composables/useAppToast'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import type { PaginationFilter } from '@/types'
import { type WorkItem } from '@/types/work-item'
import { format } from '@/utils/date'
import {
  getMoreTagsTooltip,
  getStatusLabel,
  getStatusSeverity,
  getTypeLabel,
} from '@/utils/work-item'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import {
  type ContextMenu,
  type DataTablePageEvent,
  type DataTableRowContextMenuEvent,
  type DataTableSortEvent,
} from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { onMounted, ref, useTemplateRef } from 'vue'

const { project } = storeToRefs(useProjectStore())
const pageStore = usePageStore()
pageStore.setTitle('Work Items - Boards')

const toast = useAppToast()

const selectedWorkItem = ref<WorkItem | null>(null)

const menuRef = useTemplateRef<InstanceType<typeof ContextMenu>>('menu')
const items: MenuItem[] = [
  {
    label: 'Copy to Clipboard',
    icon: 'pi pi-fw pi-clipboard',
    command: copyWorkItemToClipboard,
  },
  {
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    command: () => deleteWorkItem(),
  },
]

function onRowContextMenu(event: DataTableRowContextMenuEvent) {
  menuRef.value?.show(event.originalEvent)
}

async function copyWorkItemToClipboard() {
  const header = 'ID\tType\tTitle\tState'
  const { code, type, title, status } = selectedWorkItem.value!
  const workItemDataString = `${code}\t${getTypeLabel(type)}\t${title}\t${getStatusLabel(status)}`
  const workItemString = [header, workItemDataString].join('\n')
  await navigator.clipboard.writeText(workItemString)
  toast.showSuccess({ detail: 'Work item data copied to clipboard' })
  clearSelectedWorkItem()
}

const queryCache = useQueryCache()

const { mutate: deleteWorkItem } = useMutation({
  mutation: async () => {
    const projectId = project.value.id
    const workItemId = selectedWorkItem.value?.id
    if (!projectId || !workItemId) return
    return _deleteWorkItem(projectId, workItemId)
  },
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items', filters.value] })
    toast.showSuccess({ detail: 'Work item has been deleted successfully' })
    clearSelectedWorkItem()
  },
  onError: displayError,
})

function clearSelectedWorkItem() {
  selectedWorkItem.value = null
}

const filters = ref<PaginationFilter>({
  pageNumber: 1,
  pageSize: 10,
  sortField: 'updatedAt',
  sortOrder: 'desc',
})

const { data: workItems, isLoading } = useQuery({
  key: () => ['work-items', filters.value],
  query: () => listWorkItems(project.value.id, filters.value),
  placeholderData: (previousData) => previousData,
})

async function onSort(event: DataTableSortEvent) {
  filters.value.sortField = event.sortField as string
  filters.value.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc'
}

async function onPaginate(event: DataTablePageEvent) {
  filters.value.pageNumber = event.page + 1
  filters.value.pageSize = event.rows
}

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/work-items` },
    { label: 'Work Items', route: `/projects/${project.value.id}/work-items` },
  ])
}

onMounted(setBreadcrumbs)
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="font-semibold text-xl mb-4">Work Items</div>
        <ContextMenu ref="menu" :model="items" @hide="clearSelectedWorkItem" />
        <DataTable
          v-model:context-menu-selection="selectedWorkItem"
          :value="workItems?.items"
          :rows="filters.pageSize"
          :total-records="workItems?.totalCount"
          :rows-per-page-options="[5, 10, 20, 50]"
          :loading="isLoading"
          :page-count="workItems?.totalPages"
          lazy
          paginator
          table-style="min-width: 50rem"
          context-menu
          @sort="onSort"
          @page="onPaginate"
          @row-contextmenu="onRowContextMenu"
        >
          <Column field="code" header="ID" sortable />
          <Column field="type" header="Type" sortable style="width: 10%">
            <template #body="{ data }">
              <WorkItemTag :type="data.type" />
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
          <Column field="status" header="State" sortable style="width: 10%">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Badge :severity="getStatusSeverity(data.status)" />
                {{ getStatusLabel(data.status) }}
              </div>
            </template>
          </Column>
          <Column field="tags" header="Tags" style="width: 20%">
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
          <Column header="Activity Date" sortable style="width: 15%">
            <template #body="{ data }">
              {{ format(data.updatedAt ?? data.createdAt, 'MM/dd/yyyy hh:mm') }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
