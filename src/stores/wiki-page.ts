import { useAppToast } from '@/composables/useAppToast'
import type WikiPageGateway from '@/gateways/WikiPageGateway'
import type {
  AddCommentRequest,
  CreateWikiPageRequest,
  MoveWikiPageRequest,
  UpdateCommentRequest,
  UpdateWikiPageRequest,
  WikiPage,
  WikiPageStats,
  WikiPageSummary,
} from '@/types/wiki-page'
import { wikiPageGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useWikiPageStore = defineStore('wikiPages', () => {
  const wikiPageGateway = inject(wikiPageGatewayKey) as WikiPageGateway
  const { project } = storeToRefs(useProjectStore())
  const toast = useAppToast()
  const wikiPages = ref<WikiPageSummary[]>([])
  const wikiPage = ref<WikiPage | null>(null)
  const wikiPageStats = ref<WikiPageStats | null>(null)

  async function createWikiPage(request: CreateWikiPageRequest) {
    await wikiPageGateway.createWikiPage(project.value!.id, request)
    toast.showSuccess({ detail: 'Wiki page created successfully' })
  }

  async function updateWikiPage(wikiPageId: string, request: UpdateWikiPageRequest) {
    await wikiPageGateway.updateWikiPage(project.value!.id, wikiPageId, request)
    toast.showSuccess({ detail: 'Wiki page updated successfully' })
  }

  async function moveWikiPage(wikiPageId: string, request: MoveWikiPageRequest) {
    await wikiPageGateway.moveWikiPage(project.value!.id, wikiPageId, request)
    toast.showSuccess({ detail: 'Wiki page moved successfully' })
  }

  async function listWikiPages() {
    wikiPages.value = await wikiPageGateway.listWikiPages(project.value!.id)
  }

  async function getWikiPage(wikiPageId: string) {
    wikiPage.value = await wikiPageGateway.getWikiPage(project.value!.id, wikiPageId)
  }

  async function getWikiPageStats(wikiPageId: string) {
    wikiPageStats.value = await wikiPageGateway.getWikiPageStats(project.value!.id, wikiPageId)
  }

  async function deleteWikiPage(wikiPageId: string) {
    await wikiPageGateway.deleteWikiPage(project.value!.id, wikiPageId)
    toast.showSuccess({ detail: 'Wiki page deleted successfully' })
  }

  async function addComment(wikiPageId: string, request: AddCommentRequest) {
    await wikiPageGateway.addComment(project.value!.id, wikiPageId, request)
    toast.showSuccess({ detail: 'Comment added successfully' })
  }

  async function deleteComment(wikiPageId: string, commentId: string) {
    await wikiPageGateway.deleteComment(project.value!.id, wikiPageId, commentId)
    toast.showSuccess({ detail: 'Comment deleted successfully' })
  }

  async function updateComment(
    wikiPageId: string,
    commentId: string,
    request: UpdateCommentRequest,
  ) {
    await wikiPageGateway.updateComment(project.value!.id, wikiPageId, commentId, request)
    toast.showSuccess({ detail: 'Comment updated successfully' })
  }

  function resetWikiPage() {
    wikiPage.value = null
  }

  return {
    wikiPages,
    wikiPage,
    wikiPageStats,
    createWikiPage,
    updateWikiPage,
    moveWikiPage,
    listWikiPages,
    getWikiPage,
    getWikiPageStats,
    deleteWikiPage,
    addComment,
    deleteComment,
    updateComment,
    resetWikiPage,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWikiPageStore, import.meta.hot))
}
