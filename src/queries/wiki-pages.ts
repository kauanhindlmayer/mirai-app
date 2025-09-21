import { defineQuery, useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import { getWikiPage, getWikiPageStats, listWikiPages } from '~/api/wiki-pages'
import { useProjectStore } from '~/stores/project'
import { cacheKeys } from '~/utils/cache-keys'

export const useWikiPages = defineQuery(() => {
  const { project } = storeToRefs(useProjectStore())

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => cacheKeys.wikiPages.list(project.value.id),
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
  const route = useRoute('/projects/[projectId]/wiki-pages/[wikiPageId]/')

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => cacheKeys.wikiPages.get(project.value.id, route.params.wikiPageId),
    query: () => getWikiPage(project.value.id, route.params.wikiPageId),
    enabled: () => 'wikiPageId' in route.params,
  })

  return {
    ...query,
    wikiPage: query.data,
  }
})

export const useWikiPageStats = defineQuery(() => {
  const { project } = storeToRefs(useProjectStore())
  const route = useRoute('/projects/[projectId]/wiki-pages/[wikiPageId]/')

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => cacheKeys.wikiPages.stats(project.value.id, route.params.wikiPageId),
    query: () => getWikiPageStats(project.value.id, route.params.wikiPageId),
    enabled: () => 'wikiPageId' in route.params,
  })

  return {
    ...query,
    wikiPageStats: query.data,
  }
})
