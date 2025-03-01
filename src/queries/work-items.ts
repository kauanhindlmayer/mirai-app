import { defineQuery, useQuery } from '@pinia/colada'
import { ref } from 'vue'
import { getWorkItemsStats } from '~/api/work-items'
import type { WorkItemsStats } from '~/types/work-item'

export const useWorkItemsStats = defineQuery(() => {
  const route = useRoute('/projects/[projectId]/work-items')
  const periodInDays = ref(7)

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['work-items-stats', route.params.projectId, periodInDays.value],
    query: () => getWorkItemsStats(route.params.projectId, periodInDays.value),
    placeholderData: () => ({}) as WorkItemsStats,
  })

  return {
    ...query,
    stats: query.data,
    periodInDays,
  }
})
