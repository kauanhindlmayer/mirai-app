import { defineQuery, useQuery } from '@pinia/colada'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getWorkItemsStats } from '~/api/work-items'
import type { WorkItemsStats } from '~/types/work-item'

export const useWorkItemsStats = defineQuery(() => {
  const route = useRoute()
  const projectId = route.params.projectId as string
  const periodInDays = ref(7)

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['work-items-stats', projectId, periodInDays.value],
    query: () => getWorkItemsStats(projectId, periodInDays.value),
    placeholderData: () => ({}) as WorkItemsStats,
  })

  return {
    ...query,
    stats: query.data,
    periodInDays,
  }
})
