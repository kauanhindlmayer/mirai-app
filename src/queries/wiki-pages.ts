import { defineQuery, useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getWikiPage, getWikiPageStats, listWikiPages } from '~/api/wiki-pages'
import { useProjectStore } from '~/stores/project'

export const useWikiPages = defineQuery(() => {
  const { project } = storeToRefs(useProjectStore())

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['wiki-pages', project.value.id],
    query: () => listWikiPages(project.value.id),
    enabled: () => !!project.value,
    placeholderData: [],
  })

  return {
    ...query,
    wikiPages: query.data,
  }
})

export const useWikiPage = defineQuery(() => {
  const { project } = storeToRefs(useProjectStore())
  const route = useRoute()
  const wikiPageId = computed(() => route.params.wikiPageId as string)

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['wiki-page', wikiPageId.value],
    query: () => getWikiPage(project.value.id, wikiPageId.value),
    enabled: () => !!project.value && !!wikiPageId.value,
  })

  return {
    ...query,
    wikiPage: query.data,
  }
})

export const useWikiPageStats = defineQuery(() => {
  const { project } = storeToRefs(useProjectStore())
  const route = useRoute()
  const wikiPageId = computed(() => route.params.wikiPageId as string)

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['wiki-page-stats', wikiPageId.value],
    query: () => getWikiPageStats(project.value.id, wikiPageId.value),
    enabled: () => !!project.value && !!wikiPageId.value,
  })

  return {
    ...query,
    wikiPageStats: query.data,
  }
})
