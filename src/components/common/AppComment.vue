<script setup lang="ts">
import { useConfirm, type Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { ref, useTemplateRef } from 'vue'
import type { Comment } from '~/types/wiki-page'
import { formatDistanceToNow } from '~/utils/date'

const { comment } = defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  (event: 'delete-comment', commentId: string): void
  (event: 'update-comment', commentId: string, content: string): void
}>()

const confirm = useConfirm()

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Delete', icon: 'pi pi-trash', command: deleteComment },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

async function deleteComment() {
  confirm.require({
    header: 'Are you sure you want to delete this comment?',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      emit('delete-comment', comment.id)
    },
  })
}

const isEditing = ref(false)
const newContent = ref(comment.content)

function startEditing() {
  isEditing.value = true
}

function stopEditing() {
  const hasContentNotChanged = newContent.value === comment.content
  if (hasContentNotChanged) {
    isEditing.value = false
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
      isEditing.value = false
    },
  })
}

function updateComment() {
  emit('update-comment', comment.id, newContent.value)
  isEditing.value = false
}
</script>

<template>
  <div class="flex flex-grow">
    <Avatar
      size="large"
      shape="circle"
      :image="comment.author.imageUrl || undefined"
      :icon="comment.author.imageUrl ? undefined : 'pi pi-user'"
      class="mr-4 flex-shrink-0"
    />

    <div class="flex-grow">
      <span class="font-semibold text-surface-900 dark:text-surface-0">
        {{ comment.author.name }}
      </span>
      <p class="font-semibold text-surface-600 dark:text-surface-200 m-0 text-sm">
        {{ formatDistanceToNow(comment.createdAt) }}
        {{ comment.updatedAt ? '(edited)' : '' }}
      </p>
      <div v-if="isEditing">
        <Textarea v-model="newContent" class="w-full my-4" />
        <div class="flex justify-end gap-4">
          <Button label="Cancel" severity="secondary" @click="stopEditing" />
          <Button label="Update" @click="updateComment" />
        </div>
      </div>
      <p v-else class="leading-normal mb-0 my-4">{{ comment.content }}</p>
    </div>
  </div>
  <div class="flex place-self-start">
    <Button icon="pi pi-pencil" severity="secondary" text @click="startEditing" />
    <Button icon="pi pi-ellipsis-h" severity="secondary" text @click="toggleMenuItems" />
    <Menu ref="menu" popup :model="menuItems" />
  </div>
</template>
