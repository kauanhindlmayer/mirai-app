<script setup lang="ts">
import { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { addWikiPageComment, deleteWikiPageComment, updateWikiPageComment } from '~/api/wiki-pages'
import type { WikiPage } from '~/types/wiki-page'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const { wikiPage } = useWikiPage()
const { wikiPageStats } = useWikiPageStats()

const router = useRouter()

const emit = defineEmits<{
  (event: 'delete-wiki-page', wikiPageId: string): void
}>()

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems: MenuItem[] = [
  { label: 'Print', icon: 'pi pi-print', command: printWikiPage },
  { label: 'Link Work Items', icon: 'pi pi-link', disabled: true },
  { label: 'View Revisions', icon: 'pi pi-history', disabled: true },
  { label: 'Delete', icon: 'pi pi-trash', class: 'text-danger', command: deleteWikiPage },
]

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

const toast = useAppToast()
const queryCache = useQueryCache()

const { mutate: addCommentFn } = useMutation({
  mutation: (content: string) =>
    addWikiPageComment(project.value.id, wikiPage.value!.id, { content }),
  onSuccess() {
    invalidateWikiPageQuery()
    toast.showSuccess({ detail: 'Comment added successfully' })
  },
})

const { mutate: deleteCommentFn } = useMutation({
  mutation: (commentId: string) =>
    deleteWikiPageComment(project.value.id, wikiPage.value!.id, commentId),
  onSuccess() {
    invalidateWikiPageQuery()
    toast.showSuccess({ detail: 'Comment deleted successfully' })
  },
})

const { mutate: updateCommentFn } = useMutation({
  mutation: ({ commentId, content }: { commentId: string; content: string }) => {
    return updateWikiPageComment(project.value.id, wikiPage.value!.id, commentId, { content })
  },
  onMutate({ commentId, content }: { commentId: string; content: string }) {
    queryCache.cancelQueries({ key: ['wiki-page', wikiPage.value!.id] })

    const previousWikiPage = queryCache.getQueryData(['wiki-page', wikiPage.value!.id])

    queryCache.setQueryData(['wiki-page', wikiPage.value!.id], (old: WikiPage | undefined) => {
      if (!old) return {} as WikiPage
      return {
        ...old,
        comments: old.comments.map((comment) => {
          if (comment.id !== commentId) return comment

          return {
            ...comment,
            content,
            updatedAtUtc: new Date().toISOString(),
            isPending: true,
          }
        }),
      }
    })

    return { previousWikiPage }
  },
  onError(_error, _variables, context) {
    if (context?.previousWikiPage) {
      queryCache.setQueryData(['wiki-page', wikiPage.value!.id], context.previousWikiPage)
    }
    toast.showError({ detail: 'Failed to update comment' })
  },
  onSuccess() {
    toast.showSuccess({ detail: 'Comment updated successfully' })
  },
  onSettled() {
    invalidateWikiPageQuery()
  },
})

function invalidateWikiPageQuery() {
  queryCache.invalidateQueries({ key: ['wiki-page', wikiPage.value!.id] })
  queryCache.invalidateQueries({ key: ['wiki-page-stats', wikiPage.value!.id] })
}

const wikiPageLastUpdated = computed(() =>
  format(wikiPage.value!.updatedAtUtc ?? wikiPage.value!.createdAtUtc, "MMM d, yyyy 'at' h:mm a"),
)

function redirectToEditPage() {
  router.push(`/projects/${project.value.id}/wiki-pages/${wikiPage.value!.id}/edit`)
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
            class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded-sm"
          >
            <i class="pi pi-user text-primary mr-2" />
            <span class="text-surface-900 dark:text-surface-0">{{ wikiPage.author.name }}</span>
          </span>
          <span
            class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded-sm"
            v-tooltip.bottom="wikiPageLastUpdated"
          >
            <i class="pi pi-clock text-primary mr-2" />
            <span class="text-surface-900 dark:text-surface-0">
              {{ formatDistanceToNow(wikiPage.updatedAtUtc ?? wikiPage.createdAtUtc) }}
            </span>
          </span>
          <span
            class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded-sm"
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
        class="inline-flex items-center justify-center w-8 h-8 border border-surface-200 dark:border-surface-700 rounded-sm"
      >
        {{ wikiPage?.comments.length }}
      </span>
    </div>
    <CommentsSection
      :comments="wikiPage.comments"
      @add-comment="addCommentFn"
      @delete-comment="deleteCommentFn"
      @update-comment="(commentId, content) => updateCommentFn({ commentId, content })"
    />
  </div>
</template>
