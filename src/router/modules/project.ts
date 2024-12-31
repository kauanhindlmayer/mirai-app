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
        name: 'projects-home',
        component: () => import('@/views/projects/ProjectsList.vue'),
        meta: {
          title: 'Projects - Home',
        },
      },
      {
        path: 'projects/:projectId',
        children: [
          {
            path: 'summary',
            name: 'project-summary',
            component: () => import('@/views/projects/ProjectSummary.vue'),
            meta: {
              title: 'Summary - Overview',
              breadcrumbResolver: (project: Project) => [
                { label: project.name, route: `/projects/${project.id}/summary` },
                { label: 'Overview', route: `/projects/${project.id}/summary` },
                { label: 'Summary', route: `/projects/${project.id}/summary` },
              ],
            },
          },
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
          {
            path: 'wiki-pages/:wikiPageId?',
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
            path: 'wiki-pages/:wikiPageId/edit',
            name: 'wiki-page-edit',
            component: () => import('@/views/wiki-pages/WikiPagesList.vue'),
            props: { isEditing: true },
          },
          {
            path: 'boards',
            name: 'boards',
            component: () => import('@/views/boards/BoardsList.vue'),
          },
        ],
      },
    ],
  },
]

export default routes
