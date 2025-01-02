<script setup lang="ts">
import AppComment from '@/components/common/AppComment.vue'
import type { Comment } from '@/types/wiki-page'
import { useConfirm } from 'primevue'
import { ref } from 'vue'

defineProps<{ comments: Comment[] }>()

const emit = defineEmits<{
  (event: 'delete-comment', commentId: string): void
  (event: 'add-comment', content: string): void
}>()

const confirm = useConfirm()
const content = ref('')
const isActionButtonsVisible = ref(false)

function showActionButtons() {
  isActionButtonsVisible.value = true
}

function hideActionButtons() {
  if (!content.value) {
    isActionButtonsVisible.value = false
    return
  }
  confirm.require({
    header: 'Are you sure you want to discard this draft?',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Discard',
      severity: 'danger',
    },
    accept: () => {
      content.value = ''
      isActionButtonsVisible.value = false
    },
  })
}

async function addComment() {
  if (!content.value) return
  emit('add-comment', content.value)
  content.value = ''
}

async function deleteComment(commentId: string) {
  emit('delete-comment', commentId)
}
</script>

<template>
  <ul class="list-none p-0 m-0">
    <li
      v-for="comment in comments"
      :key="comment.id"
      class="flex justify-between p-4 mb-4 border border-surface-200 dark:border-surface-700 rounded"
    >
      <AppComment :comment="comment" @delete-comment="deleteComment" />
    </li>
    <li class="flex flex-col p-4 mb-4">
      <div class="flex mb-4">
        <Avatar size="large" shape="circle" icon="pi pi-user" class="mr-4 flex-shrink-0" />
        <Textarea
          v-model="content"
          placeholder="Add a comment..."
          class="w-full"
          @click="showActionButtons"
        />
      </div>
      <div v-if="isActionButtonsVisible" class="flex justify-end gap-4">
        <Button label="Cancel" severity="secondary" @click="hideActionButtons" />
        <Button label="Add" @click="addComment" />
      </div>
    </li>
  </ul>
</template>
