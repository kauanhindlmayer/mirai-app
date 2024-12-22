import type { WikiPage, WikiPageDetail } from '@/types'
import { httpClient } from '@/utils/http-client'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useProjectStore } from './project'

export const useWikiPageStore = defineStore('wikiPages', () => {
  const projectStore = useProjectStore()
  const { project } = storeToRefs(projectStore)
  const wikiPages = ref<WikiPage[]>([])
  const wikiPage = ref<WikiPageDetail | null>(null)

  async function listWikiPages() {
    try {
      wikiPages.value = await httpClient.get<WikiPage[]>(
        `/projects/${project.value?.id}/wiki-pages`,
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function getWikiPage(wikiPageId: string) {
    try {
      wikiPage.value = await httpClient.get<WikiPageDetail>(
        `/projects/${project.value?.id}/wiki-pages/${wikiPageId}`,
      )
    } catch (error) {
      console.error(error)
    }
  }

  return {
    wikiPages,
    wikiPage,
    listWikiPages,
    getWikiPage,
  }
})
