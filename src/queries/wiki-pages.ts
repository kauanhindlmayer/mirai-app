import { defineQuery, useQuery } from '@pinia/colada'
import { getWikiPage, getWikiPageStats, listWikiPages } from '~/api/wiki-pages'
import { useProjectContext } from '~/composables/project-context'

export const useWikiPages = defineQuery(() => {
  const { project } = useProjectContext()

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['wiki-pages', project.value.id],
    query: () => listWikiPages(project.value.id),
    enabled: () => !!project.value,
  })

  return {
    ...query,
    wikiPages: query.data,
  }
})

export const useWikiPage = defineQuery(() => {
  const { project } = useProjectContext()
  const route = useRoute('/projects/[projectId]/wiki-pages/[wikiPageId]/')

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['wiki-page', route.params.wikiPageId],
    query: () => getWikiPage(project.value.id, route.params.wikiPageId),
    enabled: () => 'wikiPageId' in route.params,
  })

  return {
    ...query,
    wikiPage: query.data,
  }
})

export const useWikiPageStats = defineQuery(() => {
  const { project } = useProjectContext()
  const route = useRoute('/projects/[projectId]/wiki-pages/[wikiPageId]/')

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['wiki-page-stats', route.params.wikiPageId],
    query: () => getWikiPageStats(project.value.id, route.params.wikiPageId),
    enabled: () => 'wikiPageId' in route.params,
  })

  return {
    ...query,
    wikiPageStats: query.data,
  }
})
