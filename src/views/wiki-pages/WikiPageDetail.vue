<script setup lang="ts">
import CommentsSection from '@/components/common/CommentsSection.vue'
import { useProjectStore } from '@/stores/project'
import { useWikiPageStore } from '@/stores/wiki-page'
import { formatDate, formatRelativeTime } from '@/utils/date'
import { storeToRefs } from 'pinia'
import { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useWikiPageStore()
const { wikiPage, wikiPageStats } = storeToRefs(store)
const { project } = storeToRefs(useProjectStore())

const emit = defineEmits<{
  (event: 'delete-wiki-page', wikiPageId: string): void
}>()

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
    <h2>${wikiPage.value!.title}</h2>
    <p>${wikiPage.value!.content}</p>
  `)
  contentDocument?.close()
  iframe.contentWindow?.focus()
  iframe.contentWindow?.print()
  document.body.removeChild(iframe)
}

function deleteWikiPage() {
  emit('delete-wiki-page', wikiPage.value!.id)
}

async function addComment(content: string) {
  await store.addComment(wikiPage.value!.id, { content })
  await store.getWikiPage(wikiPage.value!.id)
}

async function deleteComment(commentId: string) {
  await store.deleteComment(wikiPage.value!.id, commentId)
  await store.getWikiPage(wikiPage.value!.id)
}

const wikiPageLastUpdated = computed(() =>
  formatDate(wikiPage.value!.updatedAt, "MMM d, yyyy 'at' h:mm a"),
)

function redirectToEditPage() {
  router.push(`/projects/${project.value?.id}/wiki-pages/${wikiPage.value!.id}/edit`)
}
</script>

<template>
  <div v-if="wikiPage" class="card">
    <div class="flex justify-between flex-col-reverse md:flex-row items-center">
      <div>
        <div
          class="text-xl text-surface-900 dark:text-surface-0 mb-6 mt-6 md:mt-0 text-center md:text-left font-semibold md:pr-6"
        >
          {{ wikiPage.title }}
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
              {{ formatRelativeTime(wikiPage.updatedAt) }}
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

    <p class="leading-normal text-lg my-6" v-html="wikiPage.content" />

    <div class="flex items-center mb-6 font-bold">
      <span class="text-xl text-surface-900 dark:text-surface-0 mr-6">Comments</span>
      <span
        class="inline-flex items-center justify-center w-8 h-8 border border-surface-200 dark:border-surface-700 rounded"
      >
        {{ wikiPage?.comments.length }}
      </span>
    </div>
    <CommentsSection
      :comments="wikiPage.comments"
      @add-comment="addComment"
      @delete-comment="deleteComment"
    />
  </div>
</template>
