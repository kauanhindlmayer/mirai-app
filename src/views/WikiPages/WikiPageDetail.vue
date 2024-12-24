<script setup lang="ts">
import AppComment from '@/components/shared/AppComment.vue'
import { useProjectStore } from '@/stores/project'
import { useWikiPageStore } from '@/stores/wiki-page'
import type { Comment, WikiPage, WikiPageStats } from '@/types'
import { formatDate, formatRelativeTime } from '@/utils/date'
import { Menu, useConfirm } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const { wikiPage } = defineProps<{
  wikiPage: WikiPage
  wikiPageStats: WikiPageStats | null
}>()

const wikiPageStore = useWikiPageStore()
const confirm = useConfirm()

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Print', icon: 'pi pi-print', command: printWikiPage },
  { label: 'Link Work Items', icon: 'pi pi-link', disabled: true },
  { label: 'View Revisions', icon: 'pi pi-history', disabled: true },
  { label: 'Delete', icon: 'pi pi-trash', class: 'text-danger', command: deleteWikiPage },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

function printWikiPage() {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  const contentDocument = iframe.contentWindow?.document || iframe.contentDocument
  contentDocument?.open()
  contentDocument?.write(`
    <h2>${wikiPage.title}</h2>
    <p>${wikiPage.content}</p>
  `)
  contentDocument?.close()
  iframe.contentWindow?.focus()
  iframe.contentWindow?.print()
  document.body.removeChild(iframe)
}

function deleteWikiPage() {
  confirm.require({
    header: `Delete '${wikiPage.title}'?`,
    message: `'${wikiPage.title}' page and its sub-pages (if any) will be deleted. Are you sure you want to delete?`,
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
      wikiPageStore.deleteWikiPage(wikiPage.id)
    },
  })
}

const commentContent = ref('')
const isActionButtonsVisible = ref(false)

function showActionButtons() {
  isActionButtonsVisible.value = true
}

function hideActionButtons() {
  if (!commentContent.value) {
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
      commentContent.value = ''
      isActionButtonsVisible.value = false
    },
  })
}

async function addComment() {
  if (!commentContent.value) return
  await wikiPageStore.addComment(wikiPage.id, commentContent.value)
  await wikiPageStore.getWikiPage(wikiPage.id)
  commentContent.value = ''
}

async function deleteComment(comment: Comment) {
  await wikiPageStore.deleteComment(wikiPage.id, comment.id)
  await wikiPageStore.getWikiPage(wikiPage.id)
}

const wikiPageLastUpdated = computed(() =>
  formatDate(wikiPage.updatedAt, "MMM d, yyyy 'at' h:mm a"),
)

const router = useRouter()
const projectStore = useProjectStore()

function redirectToEditPage() {
  router.push(`/projects/${projectStore.project?.id}/wiki-pages/${wikiPage.id}/edit`)
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
            <span class="text-surface-900 dark:text-surface-0">{{ wikiPage.author.name }}</span>
          </span>
          <span
            class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded"
            v-tooltip.bottom="wikiPageLastUpdated"
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
            <span class="text-surface-900 dark:text-surface-0">
              {{ wikiPageStats?.views }} visits in the last 30 days
            </span>
          </span>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <Button label="Edit" severity="secondary" class="mr-4" @click="redirectToEditPage" />
        <Button
          icon="pi pi-ellipsis-v"
          severity="secondary"
          text
          rounded
          @click="toggleMenuItems"
        />
        <Menu ref="menu" popup :model="menuItems" />
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
        v-for="comment in wikiPage?.comments"
        :key="comment.id"
        class="flex justify-between p-4 mb-4 border border-surface-200 dark:border-surface-700 rounded"
      >
        <AppComment :comment="comment" @delete-comment="deleteComment" />
      </li>
      <li class="flex flex-col p-4 mb-4">
        <div class="flex mb-4">
          <Avatar size="large" shape="circle" icon="pi pi-user" class="mr-4 flex-shrink-0" />
          <Textarea
            v-model="commentContent"
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
  </div>
</template>
