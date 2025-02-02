import type { WikiPage, WikiPageStats } from '@/types/wiki-page'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useWikiPageStore = defineStore('wikiPages', () => {
  const wikiPage = ref<WikiPage | null>(null)
  const wikiPageStats = ref<WikiPageStats | null>(null)

  function setWikiPage(newWikiPage: WikiPage) {
    wikiPage.value = newWikiPage
  }

  function resetWikiPage() {
    wikiPage.value = null
  }

  return {
    wikiPage,
    wikiPageStats,
    setWikiPage,
    resetWikiPage,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWikiPageStore, import.meta.hot))
}
