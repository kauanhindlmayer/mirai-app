import type { RouteRecordRaw } from 'vue-router'

const boardsRoutes: RouteRecordRaw[] = [
  {
    path: 'boards',
    name: 'boards',
    component: () => import('~/views/boards/BoardsList.vue'),
  },
]

export default boardsRoutes
