export const usePageStore = defineStore('page', () => {
  const title = ref<string>('Mirai')
  const breadcrumbs = ref<Breadcrumb[]>([])

  function setTitle(newTitle: string) {
    title.value = newTitle
    document.title = newTitle
  }

  function setBreadcrumbs(newBreadcrumbs: Breadcrumb[]) {
    breadcrumbs.value = newBreadcrumbs
  }

  function resetBreadcrumbs() {
    breadcrumbs.value = []
  }

  return {
    title,
    breadcrumbs,
    setTitle,
    setBreadcrumbs,
    resetBreadcrumbs,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
