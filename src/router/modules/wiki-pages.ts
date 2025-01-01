import type { Project } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

const wikiPagesRoutes: RouteRecordRaw[] = [
  {
    path: 'projects/:projectId/wiki-pages/:wikiPageId?',
    name: 'wiki-pages',
    component: () => import('@/views/wiki-pages/WikiPagesList.vue'),
    meta: {
      title: 'Wiki Pages - Overview',
      breadcrumbResolver: (project: Project) => [
        { label: project.name, route: `/projects/${project.id}/summary` },
        { label: 'Overview', route: `/projects/${project.id}/wiki-pages` },
        { label: 'Wiki', route: `/projects/${project.id}/wiki-pages` },
      ],
    },
  },
  {
    path: 'projects/:projectId/wiki-pages/:wikiPageId/edit',
    name: 'wiki-page-edit',
    component: () => import('@/views/wiki-pages/WikiPagesList.vue'),
    props: { isEditing: true },
  },
]

export default wikiPagesRoutes
