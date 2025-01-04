import type { Project } from '@/types/project'
import type { RouteRecordRaw } from 'vue-router'

const workItemsRoutes: RouteRecordRaw[] = [
  {
    path: 'work-items',
    name: 'work-items',
    component: () => import('@/views/work-items/WorkItemsList.vue'),
    meta: {
      title: 'Work Items - Boards',
      breadcrumbResolver: (project: Project) => [
        { label: project.name, route: `/projects/${project.id}/summary` },
        { label: 'Boards', route: `/projects/${project.id}/work-items` },
        { label: 'Work Items', route: `/projects/${project.id}/work-items` },
      ],
    },
  },
]

export default workItemsRoutes
