import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { Breadcrumb } from '~/types/layout'

export const usePageStore = defineStore('page', () => {
  const defaultTitle = 'Mirai'
  const title = ref<string>(defaultTitle)
  const breadcrumbs = ref<Breadcrumb[]>([])

  function setTitle(newTitle: string) {
    title.value = newTitle
    document.title = newTitle || defaultTitle
  }

  function setBreadcrumbs(newBreadcrumbs: Breadcrumb[]) {
    breadcrumbs.value = newBreadcrumbs
  }

  return {
    title,
    breadcrumbs,
    setTitle,
    setBreadcrumbs,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
