import type { RouteRecordRaw } from 'vue-router'

const workItemsRoutes: RouteRecordRaw[] = [
  {
    path: 'work-items',
    name: 'work-items',
    component: () => import('~/views/work-items/WorkItemsList.vue'),
  },
]

export default workItemsRoutes
