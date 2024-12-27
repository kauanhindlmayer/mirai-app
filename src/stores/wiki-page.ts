import { displayError } from '@/composables/displayError'
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
import { defineStore } from 'pinia'
import { inject, ref, toRef } from 'vue'
import { useProjectStore } from './project'

export const useWikiPageStore = defineStore('wikiPages', () => {
  const wikiPageGateway = inject<WikiPageGateway>('wikiPageGateway')!
  const project = toRef(useProjectStore(), 'project')
  const toast = useAppToast()
  const wikiPages = ref<WikiPageSummary[]>([])
  const wikiPage = ref<WikiPage | null>(null)
  const wikiPageStats = ref<WikiPageStats | null>(null)

  async function createWikiPage(request: CreateWikiPageRequest) {
    try {
      await wikiPageGateway.createWikiPage(project.value!.id, request)
      toast.showSuccess({ detail: 'Wiki page created successfully' })
    } catch (error) {
      displayError(error)
    }
  }

  async function updateWikiPage(wikiPageId: string, request: UpdateWikiPageRequest) {
    try {
      await wikiPageGateway.updateWikiPage(project.value!.id, wikiPageId, request)
      toast.showSuccess({ detail: 'Wiki page updated successfully' })
    } catch (error) {
      displayError(error)
    }
  }

  async function moveWikiPage(wikiPageId: string, request: MoveWikiPageRequest) {
    try {
      await wikiPageGateway.moveWikiPage(project.value!.id, wikiPageId, request)
      toast.showSuccess({ detail: 'Wiki page moved successfully' })
    } catch (error) {
      displayError(error)
    }
  }

  async function listWikiPages() {
    try {
      wikiPages.value = await wikiPageGateway.listWikiPages(project.value!.id)
    } catch (error) {
      displayError(error)
    }
  }

  async function getWikiPage(wikiPageId: string) {
    try {
      wikiPage.value = await wikiPageGateway.getWikiPage(project.value!.id, wikiPageId)
    } catch (error) {
      displayError(error)
    }
  }

  async function getWikiPageStats(wikiPageId: string) {
    try {
      wikiPageStats.value = await wikiPageGateway.getWikiPageStats(project.value!.id, wikiPageId)
    } catch (error) {
      displayError(error)
    }
  }

  async function deleteWikiPage(wikiPageId: string) {
    try {
      await wikiPageGateway.deleteWikiPage(project.value!.id, wikiPageId)
      toast.showSuccess({ detail: 'Wiki page deleted successfully' })
    } catch (error) {
      displayError(error)
    }
  }

  async function addComment(wikiPageId: string, request: AddCommentRequest) {
    try {
      await wikiPageGateway.addComment(project.value!.id, wikiPageId, request)
      toast.showSuccess({ detail: 'Comment added successfully' })
    } catch (error) {
      displayError(error)
    }
  }

  async function deleteComment(wikiPageId: string, commentId: string) {
    try {
      await wikiPageGateway.deleteComment(project.value!.id, wikiPageId, commentId)
      toast.showSuccess({ detail: 'Comment deleted successfully' })
    } catch (error) {
      displayError(error)
    }
  }

  async function updateComment(
    wikiPageId: string,
    commentId: string,
    request: UpdateCommentRequest,
  ) {
    try {
      await wikiPageGateway.updateComment(project.value!.id, wikiPageId, commentId, request)
      toast.showSuccess({ detail: 'Comment updated successfully' })
    } catch (error) {
      displayError(error)
    }
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
