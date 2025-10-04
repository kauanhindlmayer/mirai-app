<script setup lang="ts">
import type { CreateWorkItemLinkRequest, WorkItemLink } from '~/types/work-item'
import AddWorkItemLinkDialog from './AddWorkItemLinkDialog.vue'

const props = defineProps<{
  outgoingLinks: WorkItemLink[]
  incomingLinks: WorkItemLink[]
  projectId: string
  workItemId: string
}>()

const emit = defineEmits<{
  'delete-link': [linkId: string]
  'create-link': [request: CreateWorkItemLinkRequest]
}>()

const addLinkDialogRef = useTemplateRef<InstanceType<typeof AddWorkItemLinkDialog>>('addLinkDialog')

const allLinks = computed(() => [...props.outgoingLinks, ...props.incomingLinks])

function handleLinkCreated(request: CreateWorkItemLinkRequest) {
  emit('create-link', request)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-if="allLinks.length === 0" class="text-surface-500 text-sm">
      No links yet. Add an existing work item as a related item.
    </div>

    <div
      v-for="link in allLinks"
      :key="link.id"
      class="flex items-start justify-between gap-2 p-2 border border-surface-200 rounded"
    >
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <Badge :severity="getStatusSeverity(link.targetWorkItem.status)" />
          <span class="font-medium text-sm line-clamp-1">
            {{ link.targetWorkItem.code }} - {{ link.targetWorkItem.title }}
          </span>
        </div>
        <div class="text-xs text-surface-500">
          {{ link.linkType }} | {{ getTypeLabel(link.targetWorkItem.type) }}
        </div>
        <div v-if="link.comment" class="text-xs text-surface-600 mt-1 italic">
          "{{ link.comment }}"
        </div>
      </div>
      <Button
        icon="pi pi-trash"
        severity="danger"
        text
        rounded
        size="small"
        v-tooltip.bottom="'Remove link'"
        @click="emit('delete-link', link.id)"
      />
    </div>

    <Button
      label="Add Link"
      icon="pi pi-plus"
      severity="secondary"
      size="small"
      outlined
      @click="addLinkDialogRef?.showDialog()"
    />
    <AddWorkItemLinkDialog
      ref="addLinkDialog"
      :project-id="projectId"
      :current-work-item-id="workItemId"
      @link-created="handleLinkCreated"
    />
  </div>
</template>
