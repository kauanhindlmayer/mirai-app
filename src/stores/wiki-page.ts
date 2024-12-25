import { displayError } from '@/composables/displayError'
import type { WikiPage, WikiPageStats, WikiPageSummary } from '@/types'
import { httpClient } from '@/utils/http-client'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useProjectStore } from './project'

export const useWikiPageStore = defineStore('wikiPages', () => {
  const projectStore = useProjectStore()
  const { project } = storeToRefs(projectStore)
  const wikiPages = ref<WikiPageSummary[]>([])
  const wikiPage = ref<WikiPage | null>(null)
  const wikiPageStats = ref<WikiPageStats | null>(null)

  async function createWikiPage(title: string, content: string, parentWikiPageId?: string) {
    try {
      await httpClient.post(`/projects/${project.value?.id}/wiki-pages`, {
        title,
        content,
        parentWikiPageId,
      })
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function updateWikiPage(wikiPageId: string, title: string, content: string) {
    try {
      await httpClient.put(`/projects/${project.value?.id}/wiki-pages/${wikiPageId}`, {
        title,
        content,
      })
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function moveWikiPage(wikiPageId: string, TargetParentId: string, targetPosition: number) {
    try {
      await httpClient.put(`/projects/${project.value?.id}/wiki-pages/${wikiPageId}/move`, {
        TargetParentId,
        targetPosition,
      })
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function listWikiPages() {
    try {
      wikiPages.value = await httpClient.get<WikiPageSummary[]>(
        `/projects/${project.value?.id}/wiki-pages`,
      )
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function getWikiPage(wikiPageId: string) {
    try {
      wikiPage.value = await httpClient.get<WikiPage>(
        `/projects/${project.value?.id}/wiki-pages/${wikiPageId}`,
      )
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function getWikiPageStats(wikiPageId: string) {
    try {
      wikiPageStats.value = await httpClient.get(
        `/projects/${project.value?.id}/wiki-pages/${wikiPageId}/stats?pageViewsForDays=30`,
      )
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function deleteWikiPage(wikiPageId: string) {
    try {
      await httpClient.delete(`/projects/${project.value?.id}/wiki-pages/${wikiPageId}`)
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function addComment(wikiPageId: string, content: string) {
    try {
      await httpClient.post(`/projects/${project.value?.id}/wiki-pages/${wikiPageId}/comments`, {
        content,
      })
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function deleteComment(wikiPageId: string, commentId: string) {
    try {
      await httpClient.delete(
        `/projects/${project.value?.id}/wiki-pages/${wikiPageId}/comments/${commentId}`,
      )
    } catch (error: unknown) {
      displayError(error)
    }
  }

  async function updateComment(wikiPageId: string, commentId: string, content: string) {
    try {
      await httpClient.put(
        `/projects/${project.value?.id}/wiki-pages/${wikiPageId}/comments/${commentId}`,
        {
          content,
        },
      )
    } catch (error: unknown) {
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
