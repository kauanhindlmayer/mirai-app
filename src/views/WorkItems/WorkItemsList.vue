<script setup lang="ts">
import { useWorkItemStore } from '@/stores/work-item'
import { WorkItemStatus, WorkItemType, type WorkItem } from '@/types'
import { formatDate } from '@/utils/date'
import { storeToRefs } from 'pinia'
import { useToast, type ContextMenu, type DataTableRowContextMenuEvent } from 'primevue'
import { onMounted, ref, useTemplateRef } from 'vue'

const toast = useToast()

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
    toast.add({
      severity: 'success',
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

onMounted(workItemStore.listWorkItems)

function getStatusSeverity(status: WorkItemStatus): string {
  const severityMap: Record<WorkItemStatus, string> = {
    [WorkItemStatus.New]: 'info',
    [WorkItemStatus.InProgress]: 'warning',
    [WorkItemStatus.Resolved]: 'success',
    [WorkItemStatus.Closed]: 'success',
    [WorkItemStatus.Reopened]: 'warning',
    [WorkItemStatus.Removed]: 'danger',
  }

  return severityMap[status] || 'info'
}

function getStatusLabel(status: WorkItemStatus): string {
  const statusMap: Record<WorkItemStatus, string> = {
    [WorkItemStatus.New]: 'New',
    [WorkItemStatus.InProgress]: 'In Progress',
    [WorkItemStatus.Resolved]: 'Resolved',
    [WorkItemStatus.Closed]: 'Closed',
    [WorkItemStatus.Reopened]: 'Reopened',
    [WorkItemStatus.Removed]: 'Removed',
  }

  return statusMap[status] || 'Unknown'
}

function getTypeSeverity(type: WorkItemType): string {
  const severityMap: Record<WorkItemType, string> = {
    [WorkItemType.UserStory]: 'info',
    [WorkItemType.Bug]: 'danger',
    [WorkItemType.Defect]: 'danger',
    [WorkItemType.Epic]: 'primary',
    [WorkItemType.Feature]: 'primary',
  }

  return severityMap[type] || 'info'
}

function getTypeLabel(type: WorkItemType): string {
  const typeMap: Record<WorkItemType, string> = {
    [WorkItemType.UserStory]: 'User Story',
    [WorkItemType.Bug]: 'Bug',
    [WorkItemType.Defect]: 'Defect',
    [WorkItemType.Epic]: 'Epic',
    [WorkItemType.Feature]: 'Feature',
  }

  return typeMap[type] || 'Unknown'
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="font-semibold text-xl mb-4">Work Items</div>
        <ContextMenu ref="menu" :model="items" @hide="clearSelectedWorkItem" />
        <DataTable
          v-model:context-menu-selection="selectedWorkItem"
          :value="workItems"
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
          paginator
          table-style="min-width: 50rem"
          context-menu
          @row-contextmenu="onRowContextMenu"
        >
          <Column field="code" header="ID" />
          <Column field="type" header="Type">
            <template #body="{ data }">
              <Tag :value="getTypeLabel(data.type)" :severity="getTypeSeverity(data.type)" />
            </template>
          </Column>
          <Column field="title" header="Title" />
          <Column field="assignedTo" header="Assigned To">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Avatar shape="circle" icon="pi pi-user" />
                {{ data.assignedTo ? data.assignedTo.name : 'Unassigned' }}
              </div>
            </template>
          </Column>
          <Column field="status" header="State">
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
                <template v-for="tag in data.tags" :key="tag">
                  <Tag :value="tag" />
                </template>
              </div>
            </template>
          </Column>
          <Column field="updatedAt" header="Activity Date">
            <template #body="{ data }">
              {{ formatDate(data.updatedAt, 'mm/dd/yyyy hh:mm') }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
