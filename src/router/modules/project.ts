import AppLayout from '@/layout/AppLayout.vue'
import type { Project } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/projects' },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/views/Projects/ProjectsList.vue'),
      },
      {
        path: 'projects/:projectId',
        children: [
          {
            path: 'summary',
            name: 'project-summary',
            component: () => import('@/views/Projects/ProjectSummary.vue'),
            meta: {
              breadcrumbResolver: (project: Project) => [
                { label: project.name, route: `/projects/${project.id}/summary` },
                { label: 'Overview', route: `/projects/${project.id}/summary` },
                { label: 'Summary', route: `/projects/${project.id}/summary` },
              ],
            },
          },
          {
            path: 'work-items',
            name: 'project-work-items',
            component: () => import('@/views/WorkItems/WorkItemsList.vue'),
            meta: {
              breadcrumbResolver: (project: Project) => [
                { label: project.name, route: `/projects/${project.id}/summary` },
                { label: 'Boards', route: `/projects/${project.id}/work-items` },
                { label: 'Work Items', route: `/projects/${project.id}/work-items` },
              ],
            },
          },
          {
            path: 'wiki',
            name: 'project-wiki-pages',
            component: () => import('@/views/WikiPages/WikiPagesList.vue'),
            meta: {
              breadcrumbResolver: (project: Project) => [
                { label: project.name, route: `/projects/${project.id}/summary` },
                { label: 'Overview', route: `/projects/${project.id}/wiki-pages` },
                { label: 'Wiki', route: `/projects/${project.id}/wiki-pages` },
              ],
            },
          },
        ],
      },
    ],
  },
]

export default routes
