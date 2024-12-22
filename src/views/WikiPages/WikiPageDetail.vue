<script setup lang="ts">
import type { WikiPageDetail } from '@/types'
import { formatRelativeTime } from '@/utils/date'
import { useConfirm } from 'primevue'
import { ref } from 'vue'

defineProps<{
  wikiPage: WikiPageDetail
}>()

const confirm = useConfirm()

const commentText = ref('')
const isActionButtonsVisible = ref(false)

function showActionButtons() {
  isActionButtonsVisible.value = true
}

function hideActionButtons() {
  if (!commentText.value) {
    isActionButtonsVisible.value = false
    return
  }
  confirm.require({
    message: 'Are you sure you want to discard this draft?',
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
      commentText.value = ''
      isActionButtonsVisible.value = false
    },
  })
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between flex-col-reverse md:flex-row items-center">
      <div>
        <div
          class="text-xl text-surface-900 dark:text-surface-0 mb-6 mt-6 md:mt-0 text-center md:text-left font-semibold md:pr-6"
        >
          {{ wikiPage?.title }}
        </div>
        <div class="flex flex-wrap justify-center md:justify-start gap-4">
          <span
            class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded"
          >
            <i class="pi pi-user text-primary mr-2" />
            <span class="text-surface-900 dark:text-surface-0">Jane Cooper</span>
          </span>
          <span
            class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded"
          >
            <i class="pi pi-clock text-primary mr-2" />
            <span class="text-surface-900 dark:text-surface-0">
              {{ formatRelativeTime(wikiPage?.updatedAt) }}
            </span>
          </span>
          <span
            class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded"
          >
            <i class="pi pi-eye text-primary mr-2" />
            <span class="text-surface-900 dark:text-surface-0">124</span>
          </span>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <Button label="Edit" severity="secondary" class="mr-4" disabled />
        <Button icon="pi pi-ellipsis-v" severity="secondary" variant="text" />
      </div>
    </div>

    <p class="leading-normal text-lg my-6">
      {{ wikiPage?.content }}
    </p>

    <div class="flex items-center mb-6 font-bold">
      <span class="text-xl text-surface-900 dark:text-surface-0 mr-6">Comments</span>
      <span
        class="inline-flex items-center justify-center w-8 h-8 border border-surface-200 dark:border-surface-700 rounded"
      >
        {{ wikiPage?.comments.length }}
      </span>
    </div>
    <ul class="list-none p-0 m-0">
      <li
        v-for="(comment, index) in wikiPage?.comments"
        :key="comment.id"
        class="flex p-4 mb-4 border border-surface-200 dark:border-surface-700 rounded"
      >
        <img
          v-if="comment.author.imageUrl"
          class="w-12 h-12 mr-4 flex-shrink-0"
          :alt="'Image' + index"
        />
        <Avatar v-else size="large" shape="circle" icon="pi pi-user" class="mr-4 flex-shrink-0" />
        <div>
          <span class="font-semibold text-surface-900 dark:text-surface-0">
            {{ comment.author.name }}
          </span>
          <p class="font-semibold text-surface-600 dark:text-surface-200 m-0 text-sm">
            {{ formatRelativeTime(comment.createdAt) }} {{ comment.updatedAt ? '(edited)' : '' }}
          </p>
          <p class="leading-normal mb-0 my-4">{{ comment.content }}</p>
        </div>
      </li>
      <li class="flex flex-col p-4 mb-4 border border-surface-200 dark:border-surface-700 rounded">
        <div class="flex mb-4">
          <Avatar size="large" shape="circle" icon="pi pi-user" class="mr-4 flex-shrink-0" />
          <Textarea
            v-model="commentText"
            placeholder="Add a comment..."
            class="w-full"
            @click="showActionButtons"
          />
        </div>
        <div v-if="isActionButtonsVisible" class="flex justify-end gap-4">
          <Button label="Cancel" severity="secondary" @click="hideActionButtons" />
          <Button label="Add" />
        </div>
      </li>
    </ul>
    <ConfirmPopup />
  </div>
</template>
