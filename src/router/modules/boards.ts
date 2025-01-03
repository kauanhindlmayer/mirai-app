import type { Project } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

const boardsRoutes: RouteRecordRaw[] = [
  {
    path: 'boards',
    name: 'boards',
    component: () => import('@/views/boards/BoardsList.vue'),
    meta: {
      title: 'Stories Board - Boards',
      breadcrumbResolver: (project: Project) => [
        { label: project.name, route: `/projects/${project.id}/summary` },
        { label: 'Boards', route: `/projects/${project.id}/boards` },
        { label: 'Boards', route: `/projects/${project.id}/boards` },
      ],
    },
  },
]

export default boardsRoutes
