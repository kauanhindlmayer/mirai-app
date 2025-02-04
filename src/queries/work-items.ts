import { getWorkItemsStats } from '@/api/work-items'
import { defineQuery, useQuery } from '@pinia/colada'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export const useWorkItemsStats = defineQuery(() => {
  const route = useRoute()
  const projectId = route.params.projectId as string
  const periodInDays = ref(7)

  const query = useQuery({
    staleTime: 1000 * 60,
    key: () => ['work-items-stats', projectId, periodInDays.value],
    query: () => getWorkItemsStats(projectId, periodInDays.value),
    placeholderData: {
      workItemsCompleted: 0,
      workItemsCreated: 0,
    },
  })

  return {
    ...query,
    stats: query.data,
    periodInDays,
  }
})
