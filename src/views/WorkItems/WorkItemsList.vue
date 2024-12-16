<script setup lang="ts">
import { useWorkItemStore } from '@/stores/work-item'
import { WorkItemStatus, WorkItemType } from '@/types'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const workItemStore = useWorkItemStore()
const { workItems } = storeToRefs(workItemStore)

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
        <DataTable
          :value="workItems"
          striped-rows
          paginator
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
          table-style="min-width: 50rem"
        >
          <Column field="code" header="ID" />
          <Column field="type" header="Type">
            <template #body="{ data }">
              <Tag :value="getTypeLabel(data.type)" :severity="getTypeSeverity(data.type)" />
            </template>
          </Column>
          <Column field="title" header="Title" />
          <Column field="assignedTo" header="Assigned To" />
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
          <Column field="updatedAt" header="Activity Date" />
        </DataTable>
      </div>
    </div>
  </div>
</template>
