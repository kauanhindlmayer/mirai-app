<script setup lang="ts">
import type { WorkItemAttachment } from '~/types/work-item'

const props = defineProps<{
  attachments: WorkItemAttachment[]
  projectId: string
  workItemId: string
}>()

const emit = defineEmits<{
  'upload-attachment': [file: File]
  'delete-attachment': [attachmentId: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const toast = useAppToast()

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement | null
  if (!input?.files?.length) return
  const file = input.files[0]
  emit('upload-attachment', file)
  input.value = ''
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function getFileIcon(contentType: string): string {
  if (contentType.startsWith('image/')) return 'pi-file-image'
  if (contentType.startsWith('video/')) return 'pi-file-video'
  if (contentType.includes('pdf')) return 'pi-file-pdf'
  if (contentType.includes('word')) return 'pi-file-word'
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'pi-file-excel'
  return 'pi-file'
}

async function handleDownload(attachment: WorkItemAttachment) {
  try {
    const blob = await downloadWorkItemAttachment(props.projectId, props.workItemId, attachment.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = attachment.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    toast.showError({ detail: 'Failed to download attachment' })
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-if="attachments.length === 0" class="text-surface-500 text-sm">
      No attachments yet. Upload files to attach them to this work item.
    </div>

    <div
      v-for="attachment in attachments"
      :key="attachment.id"
      class="flex items-center justify-between gap-2 p-2 border border-surface-200 rounded hover:bg-surface-50"
    >
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <i :class="['pi', getFileIcon(attachment.contentType), 'text-xl text-surface-500']" />
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm truncate">{{ attachment.fileName }}</div>
          <div class="text-xs text-surface-500">
            {{ formatFileSize(attachment.fileSizeBytes) }} •
            {{ format(attachment.createdAtUtc, 'MMM d, yyyy') }}
          </div>
        </div>
      </div>
      <div class="flex gap-1">
        <Button
          icon="pi pi-download"
          severity="secondary"
          text
          rounded
          size="small"
          v-tooltip.bottom="'Download'"
          @click="handleDownload(attachment)"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          v-tooltip.bottom="'Delete'"
          @click="emit('delete-attachment', attachment.id)"
        />
      </div>
    </div>
    <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
    <Button
      label="Upload File"
      icon="pi pi-upload"
      severity="secondary"
      size="small"
      outlined
      @click="fileInput?.click()"
    />
  </div>
</template>
