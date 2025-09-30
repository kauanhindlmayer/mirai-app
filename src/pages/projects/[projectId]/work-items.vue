<script setup lang="ts">
import {
  type ContextMenu,
  type DataTablePageEvent,
  type DataTableRowContextMenuEvent,
  type DataTableSortEvent,
} from 'primevue'
import type { MenuItem } from 'primevue/menuitem'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const pageStore = usePageStore()
pageStore.setTitle('Work Items - Boards')

const toast = useAppToast()

const selectedWorkItem = ref<(WorkItem & { id: string }) | null>(null)

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
    command: () => deleteWorkItemFn(),
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

const { mutate: deleteWorkItemFn } = useMutation({
  mutation: async () => deleteWorkItem(project.value.id, selectedWorkItem.value!.id),
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
  page: 1,
  pageSize: 10,
  sort: '',
  searchTerm: '',
})

async function onSort(event: DataTableSortEvent) {
  const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc'
  filters.value.sort = `${event.sortField} ${sortOrder}`
}

async function onPaginate(event: DataTablePageEvent) {
  filters.value.page = event.page + 1
  filters.value.pageSize = event.rows
}

const { data: workItems, isLoading } = useQuery({
  key: () => ['work-items', filters.value],
  query: () => listWorkItems(project.value.id, filters.value),
  placeholderData: (previousData) => previousData,
})

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
          striped-rows
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
          <Column field="title" header="Title" sortable>
            <template #body="{ data }">
              <div class="line-clamp-1">
                {{ data.title }}
              </div>
            </template>
          </Column>
          <Column field="assignee" header="Assigned To">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Avatar
                  shape="circle"
                  :image="data.assignee?.imageUrl"
                  :icon="!data.assignee?.imageUrl ? 'pi pi-user' : undefined"
                />
                {{ data.assignee?.name ?? 'Unassigned' }}
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
              {{ format(data.updatedAtUtc ?? data.createdAtUtc, 'MM/dd/yyyy hh:mm') }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
